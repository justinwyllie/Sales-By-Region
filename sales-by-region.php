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

use data from posts table and completed status? (NOT one of the dates from posts_meta)

refund examples: 616 850 3275 4088 4107 4109 4114


4114 - wc-completed shop_order_refund   _refund_amount 34.50 _order_total 34.50 WP _post_parent 3773
3773 wc-completed shop_order (note not changed to wc-refunded) _order_total 70.75 14.00 WP PARTIAL


4109 wc-completed shop_order_refund linked 4108 Feb 21 _refund_amount 6 _order_total 6 FULL
4108 wc-refunded shop_order _order_total 6 PP 

4088 wc-completed shop_order_refund linked to 4087 _order_total -6 FULL
4087 wc-refunded shop_order 6 PP

4107 Feb 21 wc-completed shop_order_refund _order_total -6 FULL
4106 wc-refunded shop_order _order_total 6   PP

3275 wc-completed shop_order_refund _refund_amount 2 PARTIAL post_parent 3181
3181 wc-completed shop_order   WP 14.50

850 Nov 2016 wc-completed  shop_order_refund linked to 848 _refund_amount 7 PARTIAL
848 wc-completed shop_order WP _order_total 141 WP

616 wc-completed shop_order_refund _refund_amount 12.50 PARTIAL
559 wc-completed shop_order dec 2015 _order_total 13.50 WP 



LIVE TEST

4736 NOW links to 4731 and is shop_order_refund wc-completed LINKS TO 4731 
4732 wc-completed shop_order_refund PARTIAL LINKS TO 4731 
4731 wc-completed shop_order PP  NB changed to wc-refunded when we did a full refund

4735 wc-completed shop_order_refund FULL MANUAL
4733 wc-completed shop_order WP

so - the switch to wc-refunded appears to be to do with a FULL PAYPAL REFUND 
BUT NOT A FULL WP REFUND - which leaves the original wc-completed
we don't know if an automatic WP refund would change to wc-refunded. cos
we aren't set up for this. 


PLAN A
so - to get INCOME - 
get all posts with date of post in range
wc-completed and shop_order - (then figs from meta)  - this gets us all INCOME
- it excludes fully refunded orders but only Paypal ones!
 -
 this query is via get_posts and either a meta key system or a filter

then we need to get partial refunds for this set:
    take IDS for this set
    look for posts which have this ID in post_parent plus wc-completed shop_order_refund
    get these posts and get the refund amount _refund_amount from postsmeta
this will have to be a purely custom query

get data
massage

ok. so test a full WP refund. if this also changes status to wp-refunded then use above system

PLAN B
the alternative is: first query gets wc-completed and wc-refunded and shop_order - gets
all fin from meta: this will get all INCOME inc. that which has been fully refunded.

then as 2nd query above - now we deduct from this all full refund amounts plus the partial refunds

actually PLAN A works: q1 will get all INCOME from WP (even if fully or partly refunded) and all
income from PayPal which is not fully refunded. we get the IDS and q2 now gets us all
refund amounts for WP (part of full) plus refund amounts for PP partial refunds but not whole
because they weren't in the set



data from posts-meta:
4603 
_billing_country GB *what codes are these?
_order_shipping 1.5
_order_total 13.50 DOES THIS INCLUDe SHIPPING? YES so goods was 12
_paid_date (FOR INFO)
_completed_date (FOR INFO)



 */
function get_orders(WP_REST_Request $request)
{
    
    $start_date = $request['start_date'];
    $end_date = $request['end_date'];
    
    //https://developer.wordpress.org/reference/functions/get_posts/ or numberposts?
    //'suppress_filters' => false

    
    $args = array(
        
        'numberposts' => -1,
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
    
    
    //what if emtpy todo $income will be empty
    $income = array();
    $ids = array();
    foreach($posts as $id) 
    {
        //TODO need to clarify if this is making db calls or not if too many need to get this via filters
        $orderTotal = get_post_meta($id, '_order_total', true);
        $ids[] = $id;
        $orderShipping = get_post_meta($id, '_order_shipping', true);
        $billingCountry = get_post_meta($id, '_billing_country', true);
        $goodsTotal = $orderTotal - $orderShipping;
        $income[$id] = array("_order_total" => $orderTotal, "_order_shipping" => $orderShipping,
           "_goods_net" => $goodsTotal, "_billing_country" => $billingCountry); 
    }

    var_dump("INCOME", $income, "----");
   

    global $wpdb;

    $pref = $wpdb->prefix;;

    if (!empty($income))
    {
        $refunds = array();
        $idsList = implode(",", $ids);
        $refundSql = <<<EOT
        SELECT p.ID, pm.meta_value, p.post_parent FROM {$pref}posts p
        INNER JOIN {$pref}postmeta pm ON p.ID = pm.post_id WHERE p.post_parent
         IN ($idsList) AND p.post_status = "wc-completed" and p.post_type 
         = "shop_order_refund" AND pm.meta_key = '_refund_amount';
EOT;
       
        //var_dump($refundSql);
        $refunds = $wpdb->get_results($refundSql);
        var_dump("REFUNDS", $refunds);
        //what is just no data?

        //remove refunds
        //deduct refunds from income - matching to parent order
        //deduct from total order which means that we deduct from order before shipping
        foreach($income as $postId => &$postData)
        {
            foreach($refunds as $row => $data)
            {
                if ($data->post_parent == $postId)
                {
                    
                    $refundAmount = $data->meta_value;
                    $postData["_order_total"] = $postData["_order_total"] - $refundAmount;
                 }
            }
            
        }
        unset($postData);

        var_dump("INCOME2", $income);
        
        $ukTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $euTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $rowTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        

        $uk = array("GB");//todo what happens to NI?
        $wcCountries = new WC_Countries();
        $eu = $wcCountries->get_european_union_countries();
        $row = array();

        //combine per region for shipping and goods totals
        foreach($income as $postId => $postData )
        {
            if (in_array($postData["_billing_country"], $uk))
            {
                $ukTotals["goods"] = $ukTotals["goods"] + $postData["_goods_net"];
                $ukTotals["shipping"] = $ukTotals["shipping"] + $postData["_order_shipping"];
                $ukTotals["total"] = $ukTotals["total"] + $postData["_order_total"];
            }
            elseif (in_array($postData["_billing_country"], $eu))
            {
                $euTotals["goods"] = $euTotals["goods"] + $postData["_goods_net"];
                $euTotals["shipping"] = $euTotals["shipping"] + $postData["_order_shipping"];
                $euTotals["total"] = $euTotals["total"] + $postData["_order_total"];
            }
            else
            {
                $rowTotals["goods"] = $rowTotals["goods"] + $postData["_goods_net"];
                $rowTotals["shipping"] = $rowTotals["shipping"] + $postData["_order_shipping"];
                $rowTotals["total"] = $rowTotals["total"] + $postData["_order_total"];
            }
            
        }

        //cross check todo
        $result = array();
        $result["uk"] = $ukTotals;
        $result["eu"] = $euTotals;
        $result["row"] = $rowTotals;

        var_dump("final result", $result);

    }
    else
    {
        //nothing at all a big zero TODO what does this return?
        $result = null;
    }

    


    //https://developer.wordpress.org/reference/classes/wp_query/#custom-field-post-meta-parameters 

    //investigate sql
    //$query = new WP_Query( $args );
    //$query_sql = $query->request;
    //echo $query_sql;
    //end investigate sql
  
    //return json_encode($result);
    return "-";
}

/*
  function () {
            return current_user_can( 'delete_site' ); //
      }
  */   

//https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
add_action( 'rest_api_init', function () {
    register_rest_route( 'sales-by-region/v1', '/sales/(?P<start_date>.+)/(?P<end_date>.+)', array(
      'methods' => 'GET',
      'callback' => 'get_orders',
      'permission_callback' => '__return_true' 

    ) );
  } );

   