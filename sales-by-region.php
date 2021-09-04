<?php
/**
 * Plugin Name: Sales By Region
 * Plugin URI: http://parkrecords.com/salesbyregion
 * Description: Sales by Region
 * Version: 1.0.0
 * Author: Justin Wyllie
 * Author URI: http://justinwylliephotography.com
 * Developer: Justin Wyllie
 * Developer URI: http://justinwylliephotography.com
 * Text Domain: sales-by-region 
 * Domain Path: /languages
 *
 * WC requires at least: 5.6
 * WC tested up to: 5.6
 *
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
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
		array(),
		filemtime( dirname( __FILE__ ) . '/build/index.css' )
	);

	wp_enqueue_script( 'sales-by-region' );
	wp_enqueue_style( 'sales-by-region' );
}
add_action( 'admin_enqueue_scripts', 'add_extension_sales_by_region' );








function add_sales_by_region_to_analytics_menu( $report_pages ) {
    $report_pages[] = array(
        'id' => 'sales-by-region',
        'title' => __('Sales by Region', 'sales-by-region'),
        'parent' => 'woocommerce-analytics',
        'path' => '/analytics/sales-by-region',
    );
    return $report_pages;
}
add_filter( 'woocommerce_analytics_report_menu_items', 'add_sales_by_region_to_analytics_menu' );



/**
 * 
 * 
 *   get_post_meta example
 *   https://developer.wordpress.org/reference/functions/get_post_meta/
 *
 *
 *   filter example
 *   https://wordpress.stackexchange.com/questions/145615/get-post-meta-in-wp-query 
 * 
 * 
 */

 
function get_orders(WP_REST_Request $request)
{
    
    $start_date = urldecode($request['start_date']);
    $end_date = urldecode($request['end_date']);

    //var_dump($start_date, $end_date);exit;
    
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

    $posts = get_posts( $args );
    
    $income = array();
    $ids = array();
    //TODO - this could be better done with a filter. But does not seem to be a problem now.
    //$start = hrtime(true);
    foreach($posts as $id) 
    {
        $orderTotal = get_post_meta($id, '_order_total', true);
        $ids[] = $id;
        $orderShipping = get_post_meta($id, '_order_shipping', true);
        $billingCountry = get_post_meta($id, '_billing_country', true);
        $goodsTotal = $orderTotal - $orderShipping;
        $income[$id] = array("_order_total" => $orderTotal, "_order_shipping" => $orderShipping,
           "_goods_net" => $goodsTotal, "_billing_country" => $billingCountry); 
    }
    //$end = hrtime(true);
    //echo "TIMETORUN";
    //echo ($end - $start) / 1000000;      // Milliseconds

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
       
        $refunds = $wpdb->get_results($refundSql);

        if (!empty($refunds))
        {
            foreach($income as $postId => &$postData)
            {
                foreach($refunds as $row => $data)
                {
                    if ($data->post_parent == $postId)
                    {
                        $refundAmount = $data->meta_value;
                        //take it off the goods first
                        if ($refundAmount <= $postData["_goods_net"])
                        {
                            $postData["_goods_net"] = $postData["_goods_net"] - $refundAmount;
                        }
                        else
                        {
                            $excessOverNetGoods = $refundAmount - $postData["_goods_net"];
                            $postData["_goods_net"] =  0;
                            $postData["_order_shipping"] = $postData["_order_shipping"] - $excessOverNetGoods;
                        }
                    }
                }
            }
        }
        unset($postData);
      
        $ukTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $euTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $rowTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        

        $uk = array("GB");
        $wcCountries = new WC_Countries();
        $eu = $wcCountries->get_european_union_countries();
        $row = array();

        foreach($income as $postId => $postData )
        {
            $goodsNet = $postData["_goods_net"];
            $orderShipping = $postData["_order_shipping"];
 
            if (in_array($postData["_billing_country"], $uk))
            {
                $ukTotals["goods"] = $ukTotals["goods"] + $goodsNet ;
                $ukTotals["shipping"] = $ukTotals["shipping"] + $orderShipping;
                $ukTotals["total"] = $ukTotals["total"] + $goodsNet + $orderShipping;
            }
            elseif (in_array($postData["_billing_country"], $eu))
            {
                $euTotals["goods"] = $euTotals["goods"] + $goodsNet;
                $euTotals["shipping"] = $euTotals["shipping"] + $orderShipping ;
                $euTotals["total"] = $euTotals["total"] + $goodsNet + $orderShipping;
            }
            else
            {
                $rowTotals["goods"] = $rowTotals["goods"] + $goodsNet;
                $rowTotals["shipping"] = $rowTotals["shipping"] + $orderShipping ;
                $rowTotals["total"] = $rowTotals["total"] + $goodsNet + $orderShipping;
            }
        }

        $result = array();
        $result["uk"] = $ukTotals;
        $result["eu"] = $euTotals;
        $result["row"] = $rowTotals;

        
        foreach($result as $region => &$values)
        {
            foreach($values as $key => &$value)  
            {
                $value = number_format($value, 2);
            } 
            unset($value);
        }
        unset($values);

    }
    else
    {
        $result = array();
    }

 
    //investigate sql
    //$query = new WP_Query( $args );
    //$query_sql = $query->request;
    //echo $query_sql;
    //end investigate sql
    
    return new WP_REST_Response( $result, 200 );
    
}



//https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
add_action( 'rest_api_init', function () {
    register_rest_route( 'sales-by-region/v1', '/sales/(?P<start_date>.+)/(?P<end_date>.+)', array(
      'methods' => 'GET',
      'callback' => 'get_orders',
      'permission_callback' => function () {
        return current_user_can( 'activate_plugins' );
  } 

    ));
  });

   