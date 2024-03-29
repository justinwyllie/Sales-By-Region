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
    $fetchMethod = urldecode($request['method']);
     
    if ($fetchMethod == "date")
    {
        $start_date = urldecode($request['param1']);
        $end_date = urldecode($request['param2']);
    }
    else //it will be order-number
    {
        $first = (int) $request['param1'];
        $last = (int) $request['param2']; 
    }


/* what is the strategy here?

we can get by date or order range. otherwise same.
looks like we get the posts which are the order for ("wc-completed","wc-processing", "wc-refunded"),
we get the payment method from the meta _payment_method
get fin data from meta
then we generate line listing blocks per payment method. e.g. ppcp-gateway ppcp-credit-card-gateway worldpay
don't know if paypal credit payments or instalments will enter diff
paypal method is previous integration (standard)
we do calculate totals on the totals and then on the per payment breakdowns

refunds:


*/

    

    if ($fetchMethod == "date") 
    { 
        $args = array(
            //also wc-processing as money is taken at this point. 
            'numberposts' => -1,
            "post_type"        => "shop_order",
            'post_status' => array("wc-completed","wc-processing", "wc-refunded"),
            "fields" => "all",
            "orderBy" => "ID",
            "order" => "ASC",
            'meta_query' => array(
                array(
                    'key'     => '_paid_date',
                    'value'   => array($start_date, $end_date),
                    'compare' => 'BETWEEN',
                    'type'=>'DATE'
                )
            )
        ); 
    }
    else
    {
        $args = array(
            //also wc-processing as money is taken at this point. 
            'numberposts' => -1,
            "post_type"        => "shop_order",
            'post_status' => array("wc-completed","wc-processing", "wc-refunded"),
            "fields" => "all",
            "orderBy" => "ID",
            "order" => "ASC",
            "post__in" => range($first, $last)
        );   
    }


    //DEBUG
      // $the_object = new WP_Query($args);

    // show the mysql as a string
       // echo $the_object->request;
        //( wp_posts.post_date >= '2021-11-01 00:00:00' AND wp_posts.post_date <= '2021-11-24 23:59:59' )

    //DEBUG

    $posts = get_posts( $args );
    

    $income = array();
    $incomeByPaymentMethod = array();
    $lineListing = array();
    $lineListingByPaymentMethod = array();
    $paymentMethods = array();

    $uk = array("GB");
    $wcCountries = new WC_Countries();
    $eu = $wcCountries->get_european_union_countries();
    $ukText = "UK";
    $euText = "EU";
    $rowText = "ROW";
    
    //TODO - this could be better done with a filter. But does not seem to be a problem now.
    //$start = hrtime(true);
    //go through data and create two data structures: one which combines 
    //payment methods and one which separates them 
    //worldpay paypal ppcp-gateway ppcp-credit-card-gateway
    //guess that consumer credit will also appear as ppcp-gateway
    //paypal is probably historic but we need to support it. 
    foreach($posts as $post) 
    {
        $id = $post->ID;
        $orderTotal = get_post_meta($id, '_order_total', true);
        $ids[] = $id;
        $orderShipping = get_post_meta($id, '_order_shipping', true);
        $orderShipping = round($orderShipping, 2);
        $orderTotal = round($orderTotal, 2);
        $paidDate = get_post_meta($id, '_paid_date', true);
        $name = get_post_meta($id, '_billing_last_name', true);
        $paymentMethod = get_post_meta($id, '_payment_method', true);
        $paymentMethodOriginal = $paymentMethod;
        
        //treat all paypal routes as one
        if (substr($paymentMethod, 0, 4) == "ppcp")
        {
            $paymentMethod = 'paypal'; 
        }

        if (!in_array($paymentMethod, $paymentMethods))
        {
            $paymentMethods[] = $paymentMethod;    
        }

        $billingCountry = get_post_meta($id, '_billing_country', true);
        $goodsTotal = $orderTotal - $orderShipping;
        $goodsTotal = round($goodsTotal, 2);
        

        
        //combined
        $listingDetail = array();
        $listingDetail['Order'] = $id;
        $listingDetail['Name'] = $name;
        $listingDetail['amountGoods'] = number_format($goodsTotal, 2);
        $listingDetail['amountTotal'] = number_format($orderTotal, 2);
        $date = new DateTime($paidDate);
        $paidDate = date_format($date,"d-m-Y");
        $listingDetail['paidDate'] = $paidDate;
        $listingDetail['billingCountry'] = $billingCountry;

        if (in_array($billingCountry, $uk))
        {
            $listingDetail['region'] = $ukText;
        }
        elseif (in_array($billingCountry, $eu))
        {
            $listingDetail['region'] = $euText;
        }
        else
        {
            $listingDetail['region'] = $rowText;
        }
        $listingDetail['paymentMethod'] = $paymentMethod;
        $listingDetail['paymentMethodOriginal'] = $paymentMethodOriginal;

        
        
        $lineListing[] = $listingDetail;
        $income[$id] = array("_order_total" => $orderTotal, "_order_shipping" => $orderShipping,
           "_goods_net" => $goodsTotal, "_billing_country" => $billingCountry); 
//jw fixup - hack it here to combine paypal methods first 4 chars seem to be ppcp
        //this is sorting them out into blocks per payment method
        if (! isset($incomeByPaymentMethod[$paymentMethod]))
        {
            $incomeByPaymentMethod[$paymentMethod] = array();
        }
        $incomeByPaymentMethod[$paymentMethod][$id] = array("_order_total" => $orderTotal, 
            "_order_shipping" => $orderShipping,
           "_goods_net" => $goodsTotal, "_billing_country" => $billingCountry);  

    }

    //separated line listing 
    foreach ($paymentMethods as $paymentMethod)
    {
        
        $lineListingByPaymentMethod[$paymentMethod] = array();   
    }
    foreach ($lineListing as $listingDetail)
    {
        $lineListingByPaymentMethod[$listingDetail['paymentMethod']][] = $listingDetail;
    }



 
    //$end = hrtime(true);
    //echo "TIMETORUN";
    //echo ($end - $start) / 1000000;      // Milliseconds

    global $wpdb;

    $pref = $wpdb->prefix;

    //set the result structure
    $result = array();
    $result["lineListing"] = $lineListing;
    $result["lineListingByPaymentMethod"] = $lineListingByPaymentMethod;
    $result["combinedTotals"] = array();
    $result["totalsByPaymentMethod"] = array();
    
    $result["paymentMethods"] = $paymentMethods;

   

    //create overall totals for combined data and for separated data
    /**
     * @param $rows - array of arrays of orders with details
     * @return an array with totals for uk, eu and row
     */
    function calculateTotals($rows)
    {
        //todo why doesn't global work? 
        $uk = array("GB");
        $wcCountries = new WC_Countries();
        $eu = $wcCountries->get_european_union_countries();
       
        $ukTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $euTotals = array("goods"=>0, "shipping"=>0, "total"=>0);
        $rowTotals = array("goods"=>0, "shipping"=>0, "total"=>0);

        $row = array();

        foreach($rows as $postId => $postData )
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

        $ret = array();
        $ret["sales"] = array();
        $ret["sales"]["uk"] = $ukTotals;
        $ret["sales"]["eu"] = $euTotals;
        $ret["sales"]["row"] = $rowTotals;
        

        foreach($ret["sales"] as $region => &$values)
        {
            foreach($values as $key => &$value)  
            {
                $value = number_format($value, 2);
            } 
            unset($value);
        }
        unset($values);

        return $ret; 
    }
    
    if (!empty($income))
    {   
        $result["combinedTotals"] = calculateTotals($income);
        
    }
    if (!empty($incomeByPaymentMethod))
    {   foreach ($paymentMethods as $method)
        {
            $result["totalsByPaymentMethod"][$method] = calculateTotals($incomeByPaymentMethod[$method]);
        }
    }
   

    //REFUNDS
    //http://dev.parkrecords.com/wp-admin/post.php?post=4616&action=edit
    //this gets refund posts in same time period
    //refunds are stored as posts with a link via post_parent
    //to the original post which is being refunded 
    //joins to postmeta to get amount
    //rejoins to posts to get parent post original order
    //then joins this to meta to get name and billing country
    //source order post id / amount / name / bill-country

    if ($fetchMethod == "date")
    {
         $refundSql = "SELECT pp.ID as 'Order', DATE_FORMAT(p.post_date, '%e-%m-%Y') as 'refundDate', FORMAT(pm.meta_value, 2) as 'Amount', " .
         " pmparent.meta_value as 'Customer', pmparent2.meta_value as 'billingCountry'" .
         " FROM " . $pref . "posts p INNER JOIN " . 
         $pref . "postmeta pm ON p.ID = pm.post_id INNER JOIN " . $pref . "posts pp ON p.post_parent " .
         " = pp.ID INNER JOIN " . $pref . "postmeta pmparent ON pmparent.post_id = pp.ID " .
         " INNER JOIN " . $pref . "postmeta pmparent2 ON pmparent2.post_id = pp.ID" .
         " WHERE p.post_date >= '%s' AND p.post_date <= '%s' " .
         " AND p.post_status = 'wc-completed' and p.post_type = 'shop_order_refund' AND " .
         " pm.meta_key = '_refund_amount' AND pmparent.meta_key = '_billing_last_name' AND " .
         " pmparent2.meta_key = '_billing_country'" ;
        
        $refunds = $wpdb->get_results($wpdb->prepare($refundSql, [$start_date, $end_date]));
        
    }
    else
    {//this gets refunds which were made against the order ids in the main query

        $refundSql = "SELECT pp.ID as 'Order', DATE_FORMAT(p.post_date, '%e-%m-%Y') as 'refundDate', FORMAT(pm.meta_value, 2) as 'Amount', " .
         " pmparent.meta_value as 'Customer', pmparent2.meta_value as 'billingCountry'" .
         " FROM " . $pref . "posts p INNER JOIN " . 
         $pref . "postmeta pm ON p.ID = pm.post_id INNER JOIN " . $pref . "posts pp ON p.post_parent " .
         " = pp.ID INNER JOIN " . $pref . "postmeta pmparent ON pmparent.post_id = pp.ID " .
         " INNER JOIN " . $pref . "postmeta pmparent2 ON pmparent2.post_id = pp.ID" .
         " WHERE pp.ID >= %d AND pp.ID <= %d " .
         " AND p.post_status = 'wc-completed' and p.post_type = 'shop_order_refund' AND " .
         " pm.meta_key = '_refund_amount' AND pmparent.meta_key = '_billing_last_name' AND " .
         " pmparent2.meta_key = '_billing_country'" ;

        
        $refunds = $wpdb->get_results($wpdb->prepare($refundSql, [$first, $last]));   
    }




        if (is_null($refunds))
        {
            $result["refunds"] = array();
        }
        else
        {
            
            foreach ($refunds as &$refund)   
            {
                if (in_array($refund->billingCountry, $uk))
                {
                    $refund->billingRegion = $ukText;
                }
                elseif (in_array($refund->billingCountry, $eu))
                {
                    $refund->billingRegion =  $euText;
                }
                else
                {
                    $refund->billingRegion  = $rowText;
                }   
            }
            //unset($refund);
            $result["refunds"] = $refunds;
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
    
    register_rest_route( 'sales-by-region/v1', '/sales/(?P<method>.+)/(?P<param1>.+)/(?P<param2>.+)', array(
      'methods' => 'GET',
      'callback' => 'get_orders',
      'permission_callback' => function () {
        return current_user_can( 'activate_plugins' );
        } 

    ));




  });

   