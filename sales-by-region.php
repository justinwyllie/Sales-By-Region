<?php
/**
 * Plugin Name: Sales By Region
 * 
 * @package WooCommerce\Admin
 */

/**
 * Register the JS.
 * * http://dev.parkrecords.com/wp-json/sales-by-region/v1?start-date=d1&end-date=d2
 * http://dev.parkrecords.com/wp-json/sales-by-region/v1/sales/7-7-2021/12-7-2021
 *
 */
function add_extension_sales_by_region() {
	if ( ! class_exists( 'Automattic\WooCommerce\Admin\Loader' ) || ! \Automattic\WooCommerce\Admin\Loader::is_admin_or_embed_page() ) {
		return;
	}
	
	$script_path       = '/build/index.js';
	$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';
	$script_asset      = file_exists( $script_asset_path )
		? require( $script_asset_path )
		: array( 'dependencies' => array(), 'version' => filemtime( $script_path ) );
	$script_url = plugins_url( $script_path, __FILE__ );

	wp_register_script(
		'sales-by-region',
		$script_url,
		$script_asset['dependencies'],
		$script_asset['version'],
		true
	);

	wp_register_style(
		'sales-by-region',
		plugins_url( '/build/index.css', __FILE__ ),
		// Add any dependencies styles may have, such as wp-components.
		array(),
		filemtime( dirname( __FILE__ ) . '/build/index.css' )
	);

	wp_enqueue_script( 'sales-by-region' );
	wp_enqueue_style( 'sales-by-region' );
}

add_action( 'admin_enqueue_scripts', 'add_extension_sales_by_region' );


add_filter( 'woocommerce_analytics_report_menu_items', 'add_sales_by_region_to_analytics_menu' );
function add_sales_by_region_to_analytics_menu( $report_pages ) {
    $report_pages[] = array(
        'id' => 'sales-by-region',
        'title' => __('Sales by Region', 'sales-by-region'),
        'parent' => 'woocommerce-analytics',
        'path' => '/analytics/sales-by-region',
    );
    return $report_pages;
}

//add custom endpoint to get the data from the postmeta
/*
use WP Query or wpdb and custom?
The standard WP_Query does not return a posts meta data. 
The only options you have are to: 1) run get_post_meta on individual keys, 
2) run get_post_custom to get all of a posts custom fields in one shot, or
 3) create your own query using the $wpdb class (get_results()) to build your own return object.
https://wordpress.stackexchange.com/questions/172041/can-wp-query-return-posts-meta-in-a-single-request

need to understand how refunds are handled
my results should not include refunded amounts
do i have to deal with partial refunds? technically is it possible. 2 cds and they refund one!
wc-completed
wc-refunded 

*/

function sales_by_region_filter_by_date($where = '')
{
    $where .= " AND post_date > '" . date('Y-m-d', strtotime('-30 days')) . "'";
    return $where;
}
/**
 * 
 * array('year'=>'2021','month'=>'05','day'=>'1'),
 * todo - refunds / get date test is based on __completed in post meta? (pres. post_data is first order)
 * completed won't be till they press the button for paypal? (btw can we remove WorldPay?)
 * is curr always GBP check
 * 
 * get_post_meta - call it once for each id in a loop? hmm. 
 * https://developer.wordpress.org/reference/functions/get_post_meta/
 * https://wordpress.stackexchange.com/questions/167060/custom-post-meta-field-effect-on-the-performance-on-the-post/167151#167151
 * get all fields in one go... 
 * 
 *   "meta_query" => array(
                array('key' => '_paid_date',
                'value' => array($start_date, $end_date),
                'type' => 'DATE',
                'compare' => 'BETWEEN')
        )   
 *     ,
            filter example
            https://wordpress.stackexchange.com/questions/145615/get-post-meta-in-wp-query 
 * 
 * 
SELECT  wp_posts.post_date, wp_posts.ID , wp_postmeta.* FROM wp_posts  INNER JOIN wp_postmeta ON ( wp_posts.ID = wp_postmeta.post_id )  WHERE 1=1  AND ( 
  ( wp_posts.post_date >= '2021-01-01 00:00:00' AND wp_posts.post_date <= '2021-05-12 00:00:00' )
) AND wp_posts.post_type = 'shop_order' AND ((wp_posts.post_status = 'wc-completed')) AND (wp_postmeta.meta_key IN ('_paid_date', '_completed_date', '_payment_method'))
ORDER BY wp_posts.ID DESC

TODO - permissions / refunds
 */
function get_orders(WP_REST_Request $request)
{
    
    $start_date = $request['start_date'];
    $end_date = $request['end_date'];
    
    //https://developer.wordpress.org/reference/functions/get_posts/ or numberposts?
    //'suppress_filters' => false

    
    $args = array(
        
        'numberposts' => 25,
        "post_type"        => "shop_order",
        'post_status' => "wc-completed",
        "fields" => "ids",
        "date_query" => array(
            'after' => $start_date,
            'before' => $end_date,
            'inclusive' => true
            ) 
        
    
          
    );
    //
    //https://developer.wordpress.org/reference/classes/wp_query/#methods
    $posts = get_posts( $args );
    //https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters 

    //investigate sql
    $query = new WP_Query( $args );
    $query_sql = $query->request;
     echo $query_sql;
    //end investigate sql
  
    if ( !empty($posts) ) 
    {
        $data = $posts;
    }
    else 
    {
        $data = null;
    }
    //here goes data query 
    $data_json = json_encode($data);
    return $data_json;
}

//https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
add_action( 'rest_api_init', function () {
    register_rest_route( 'sales-by-region/v1', '/sales/(?P<start_date>.+)/(?P<end_date>.+)', array(
      'methods' => 'GET',
      'callback' => 'get_orders'

    ) );
  } );