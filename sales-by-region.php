<?php
/**
 * Plugin Name: Sales By Region
 *
 * @package WooCommerce\Admin
 */

/**
 * Register the JS.
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

function get_orders(WP_REST_Request $request)
{
    
    $start_date = $request['start_date'];
    $end_date = $request['end_date'];

   
    //https://developer.wordpress.org/reference/functions/get_posts/ or numberposts?
    $args = array(
        
        'numberposts' => 25,
        "post_type"        => "shop_order",
        'post_status' => "wc-completed",
        "fields" => "ids"
    );
    //https://developer.wordpress.org/reference/classes/wp_query/#methods
    $posts = get_posts( $args );
  
 
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