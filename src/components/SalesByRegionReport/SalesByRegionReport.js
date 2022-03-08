import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {TableCard, ReportFilters} from '@woocommerce/components';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings'; 
import apiFetch from '@wordpress/api-fetch';    

/*
https://gorohovsky.com/extending-woocommerce-javascript-react/
https://github.com/woocommerce/woocommerce-admin/blob/main/client/analytics/components/report-table/index.js 

Build issues - depreacted webpack
https://github.com/vercel/next.js/issues/15576 (maybe update wp scripts? look at the mini-css)

https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported
looks like need to downgrade node from 17.5.0 

*/



function DisplayError(props)
{
    return <p className="salesByRegionError">{props.message}</p>; 
}

class LineListing extends ReactComponent {

    constructor(props) {
        super(props);
        this.handleSort = this.handleSort.bind(this);
         
       const defaultSortColumn = 'Order';
       
       const defaultSortOrder = 'asc';
       const lineListingSortedByDefault = this.sort(this.props.lineListing, defaultSortColumn, defaultSortOrder);

       this.state = {
        error: false,   
        lineListingData: lineListingSortedByDefault,
        sortColumn: defaultSortColumn,
        sortOrder: defaultSortOrder
        }
    }

    setHeaderSortOptions(header) {
        if (header.key === this.state.sortColumn) {
            header.defaultSort = true;
            header.defaultOrder = this.state.sortOrder;
        } else {
            if (header.defaultSort) delete header.defaultSort;
            if (header.defaultOrder) delete header.defaultOrder;
        }
        return header;
    }
    /* TODO sort by dates and display in preferred format 
     or something manual like use d-m-Y from PHP and 
    mnanually fix that here in a function then Date()*/
    sort(data, column, sortOrder) {

        const upDate = (val) =>
        {
            if (column == "Order")
            {
                let newVal = parseInt(val);
                return newVal;
                
            }
            else if (column == "paidDate")
            {
                let newVal = val.split("-").reverse().join("-"); //d-m-Y to Y-m-d
                let newValDate = new Date(newVal);
                return newValDate;
            }
            else
            {
                return val;
            }

        }
        
        const appliedSortOrder = sortOrder === 'asc' ? 1 : -1;
        return data.sort((a, b) => {
            
            
            if (upDate(a[column]) == upDate(b[column]))
            {
                return 0;
            }
 
            if (upDate(a[column]) > upDate(b[column])) 
            {
                return appliedSortOrder;    
            }
            
            if (upDate(a[column]) < upDate(b[column])) 
            {
                return -1 * appliedSortOrder;
            }
            
            

            
  
        });
    }

    changeSortOrder(order) {
        return order === 'asc' ? 'desc' : 'asc';
    }

    handleSort(newSortColumn) {
        let {lineListingData, sortColumn, sortOrder} = this.state;
        if (sortColumn === newSortColumn) {
            lineListingData.reverse();
            sortOrder = this.changeSortOrder(sortOrder);
        }
        else {
            sortColumn = newSortColumn;
            lineListingData = this.sort(lineListingData, sortColumn, sortOrder);
        }
        this.setState({
            lineListingData: lineListingData,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
         });
    }

    

    render() {
        
        const lineListingData = this.state.lineListingData;

        const tableHeaders = [
            {key: 'Order', label: 'Order Id', isLeftAligned: true, isSortable: true, required: true},
            {key: 'customer', label: 'Customer', isLeftAligned: true, isSortable: false, required: true},
            {key: 'paidDate', label: 'Capture Date (d-m-y)', isLeftAligned: false, isSortable: true, required: true},
            {key: 'amountGoods', label: 'Amount Goods (' + this.props.currency + ')', isLeftAligned: true, isSortable: false, required: true},
            {key: 'amountTotal', label: 'Amount Total (' + this.props.currency + ')', isLeftAligned: true, isSortable: false, required: true},
            {key: 'billing-country', label: 'Billing Country', isLeftAligned: true, isSortable: false, required: true},
            {key: 'region', label: 'Region', isLeftAligned: true, isSortable: true, required: true},
            {key: 'payment-method', label: 'Payment Method', isLeftAligned: true, isSortable: false, required: true}

       ];

        const tableRows = new Array();
        for (const lineListing of lineListingData)
        {
            let orderNo = lineListing.Order;
            let href= "/wp-admin/post.php?post=" + orderNo + "&action=edit";
            let link = <a href={href}>{orderNo}</a>;
            tableRows.push( [
                {key: 'Order', display: link },
                {key: 'customer', display: lineListing.Name},
                {key: 'paidDate', display: lineListing.paidDate},
                {key: 'amountGoods', display: lineListing.amountGoods},
                {key: 'amountTotal', display: lineListing.amountTotal},
                {key: 'billing-country', display: lineListing.billingCountry },
                {key: 'region', display: lineListing.region },
                {key: 'payment-method', display: lineListing.paymentMethod }
            ] );
        }
        
        return <Fragment>
            <div className="salesByRegion">
                <TableCard 
                    title={this.props.heading}
                    rows={tableRows}
                    headers={tableHeaders.map(header => this.setHeaderSortOptions(header))}
                    rowsPerPage={10000}
                    totalRows={tableRows.length}
                    onSort={this.handleSort}
                    >
                 </TableCard>
            </div>
            </Fragment>

    }    

} 

class Refunds extends ReactComponent {

    constructor(props) {
        super(props);
        this.state = {
             error: false
        };
    }

    render() {
        
        const tableHeaders = [
            {key: 'order', label: 'Order Id', isLeftAligned: true, isSortable: false, required: true},
            {key: 'amount', label: 'Amount (' + this.props.currency + ')', isLeftAligned: true, isSortable: false, required: true},
            {key: 'date', label: 'Date of refund (d-m-y)', isLeftAligned: true, isSortable: false, required: true},
            {key: 'customer', label: 'Customer', isLeftAligned: true, isSortable: false, required: true},
            {key: 'billingCountry', label: 'Billing Country', isLeftAligned: true, isSortable: false, required: true},
            {key: 'billingRegion', label: 'Billing Region', isLeftAligned: true, isSortable: false, required: true}
      
        ];

        const tableRows = new Array();
        for (const refund of this.props.refunds)
        {
            let orderNo = refund.Order;
            let href= "/wp-admin/post.php?post=" + orderNo + "&action=edit";
            let link = <a href={href}>{orderNo}</a>;
            tableRows.push( [
                {display: link },
                {display: refund.Amount},
                {display: refund.refundDate},
                {display: refund.Customer},
                {display: refund.billingCountry },
                {display: refund.billingRegion }
            ] );
        }
        
        return <Fragment>
            <TableCard 
                    title="Refunds"
                    rows={tableRows}
                    headers={tableHeaders}
                    rowsPerPage={10000}
                    totalRows={tableRows.length}>
                 </TableCard>
            </Fragment>

    }    

}    

class TableDisplay extends ReactComponent {

    constructor(props) {
        super(props);
        this.state = {
             error: false
        };
    }

    testRender() {
        //crazy check of render here
        const ukGoods = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(2) th + td").textContent;
        const ukShipping = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(3) th + td").textContent;
        const ukTotal = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(4) th + td").textContent;
        const euGoods = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(2) td:nth-child(3)").textContent;
        const euShipping = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(3) td:nth-child(3)").textContent;
        const euTotal = 
            document.querySelector("div.woocommerce-table__table table tr:nth-child(4) td:nth-child(3)").textContent;
            
        let error = false;
        if (ukGoods != this.props.sales['uk']['goods'])
        {
            error = true;
        }    
        if (ukShipping != this.props.sales['uk']['shipping'])
        {
            error = true;
        }  
        if (ukTotal != this.props.sales['uk']['total'])
        {
            error = true;
        }  
        if (euGoods != this.props.sales['eu']['goods'])
        {
            error = true;
        }  
        if (euShipping != this.props.sales['eu']['shipping'])
        {
            error = true;
        }  
        if (euTotal != this.props.sales['eu']['total'])
        {
            error = true;
        }  

        if (error)
        {
            this.setState({"error": true});
        }

    }

    componentDidUpdate() {
        
        if (!this.state.error)
        {
            //this.testRender();
        }   
    }    

    componentDidMount() {
        
        if (!this.state.error)
        {
            //this.testRender();
        }
    }  

    render() {
        
        const tableHeaders = [
            {key: '-', label: '',  isSortable: false, required: true},
            {key: 'uk', label: 'UK', isLeftAligned: true, isSortable: false, required: true},
            {key: 'eu', label: 'EU', isLeftAligned: true, isSortable: false, required: true},
            {key: 'row', label: 'ROW', isLeftAligned: true, isSortable: false, required: true},
        ];

        const tableRows = [
            [{display: 'Goods net (' + this.props.currency + ')'},{display: this.props.sales['uk']['goods'] },
                {display: this.props.sales['eu']['goods']}, {display: this.props.sales['row']['goods']}],
                [{display: 'Shipping (' + this.props.currency + ')'},{display: this.props.sales['uk']['shipping'] },
                {display: this.props.sales['eu']['shipping']}, {display: this.props.sales['row']['shipping']}],
                [{display: 'Total (' + this.props.currency + ')'},{display: this.props.sales['uk']['total'] },
                {display: this.props.sales['eu']['total']}, {display: this.props.sales['row']['total']}],
        ];

        if (this.state.error)
        {
            
            return <DisplayError message="Sorry. An error has occurred. Please contact support." />
        }
        else
        {
        return <TableCard 
                    title={this.props.heading}
                    rows={tableRows}
                    headers={tableHeaders}
                    rowsPerPage={100}
                    totalRows={tableRows.length}>
                 </TableCard>
        }          
    }
}


export class SalesByRegionReport extends ReactComponent {

    constructor(props) {
        super(props);
        
        const dateQuery = this.createDateQuery(this.props.query);
        const storeCurrency = new Currency(storeCurrencySetting);

   
        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            data: { loading: true },
            error: false,
            firstOrderNumber: 0,
            lastOrderNumber: 0,
            errorMessage: "Sorry. An error has occured. Please try again later",
            orderNumberError: false,
            fetchMethod: "date"

        };
        
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getQueryParameters = this.getQueryParameters.bind(this);
        this.prepareData = this.prepareData.bind(this);
        this.filterByOrderNumber = this.filterByOrderNumber.bind(this);
        this.setFirstOrderNumber = this.setFirstOrderNumber.bind(this);
        this.setLastOrderNumber = this.setLastOrderNumber.bind(this);
    }

    componentDidMount()
    {
        this.fetchData("date", this.state.dateQuery);
    }

    fetchData(method, dateQuery, first, last) {
             
        this.setState({fetchMethod: method})
        if(!this.state.data.loading) this.setState({data: {loading: true}});
        const endPoints = {
             'salesByRegion': '/sales-by-region/v1/sales/date',
             'salesByRegionOrderNumber': '/sales-by-region/v1/sales/order-number'
        };

        let salesPath;
        if (method == "date")
        {
            const queryParameters = this.getQueryParameters(dateQuery);
            salesPath = endPoints.salesByRegion + queryParameters;
        }
        else if (method == "order-number")
        {
            salesPath = endPoints.salesByRegionOrderNumber + "/" + first  + "/" + last;
        }
        else 
        {
            this.setState({error: true});
        }
        

        apiFetch({path: salesPath, parse: true}).then((fetchedData) =>
            {
                const data = this.prepareData(fetchedData);
                this.setState({data: data});
                this.setState({error: false});
            }
        )
        .catch( (err) => {
            this.setState({error: true});
            
        })
     }


    getQueryParameters(dateQuery) {
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, 'start'));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, 'end'));
        return `/${afterDate}/${beforeDate}`;
    }

    prepareData(salesDataParam) {
        
        let data;
        data = {
            sales: salesDataParam.combinedTotals.sales, 
            salesByPaymentMethod: salesDataParam.totalsByPaymentMethod, 
            refunds: salesDataParam.refunds, 
            lineListing: salesDataParam.lineListing, 
            lineListingByPaymentMethod: salesDataParam.lineListingByPaymentMethod ,
            paymentMethods : salesDataParam.paymentMethods
        };
        data.loading = false;
        
        return data;
    }

    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    handleDateChange(newQuery) {
        this.setState({orderNumberError: false, firstOrderNumber: 0, lastOrderNumber: 0}); 
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
        this.fetchData("date", newDateQuery);
    }

    filterByOrderNumber() {
        
        const first = this.state.firstOrderNumber;
        const last = this.state.lastOrderNumber;
        if ((first == 0) || (last == 0))
        {
            this.setState({orderNumberError: true});  

        }
        else
        {
            this.setState({orderNumberError: false}); 
            this.fetchData("order-number", undefined, first, last);
         
        }
    }

    setFirstOrderNumber(event) {
        this.setState({firstOrderNumber: event.target.value});
    }

    setLastOrderNumber(event) {
        this.setState({lastOrderNumber: event.target.value});
    }

    render() {

        const reportFilters =
            <ReportFilters
                dateQuery={this.state.dateQuery}
                query={this.props.query}
                path={this.props.path}
                currency={this.state.currency}
                isoDateFormat={isoDateFormat}
                onDateSelect={this.handleDateChange}
            />;
   
        let searchLabel;
        
        if (this.state.fetchMethod == "date")
        {
            const range = decodeURIComponent(this.getQueryParameters(this.state.dateQuery));
            
            let vals = range.split("/");
   
            const startDate = vals[1].substring(0, vals[1].indexOf('T'));
            const endDate = vals[2].substring(0, vals[2].indexOf('T'));
            //yyyy-mm-dd to dd-mm-yyyy

            const ukStartDate = startDate.split("-").reverse().join("-"); 
            const ukEndDate = endDate.split("-").reverse().join("-"); 

  
            searchLabel = <div className="sales-by-region-emphasis">
                <span>Search Method: Date. From {ukStartDate} to {ukEndDate} </span>
            </div>;
        }
        else if (this.state.fetchMethod == "order-number")
        {
            searchLabel = <div className="sales-by-region-emphasis">
                <span>Search Method: Order number. From: {this.state.firstOrderNumber} 
                     <span> to {this.state.lastOrderNumber} </span></span>
            </div>;
        }
     

        if (this.state.error) 
        { 
             return <DisplayError message={this.state.errorMessage}>
                    </DisplayError> 
        } 
        else if (this.state.data.loading) 
        {
            return <p>Waiting...</p>    
        }
        else
        {
            return <Fragment>
                <div className="sales-by-region-box">
                    
                    <div> 
                        {reportFilters} 
                    </div>       
                   
                    <div>
                        {(this.state.orderNumberError) ? <span className="sales-by-region-error">Please
                            enter a value in both fields</span> : <span></span>}
                        <p>Order Number Range:</p>
                        First: <input id="first-order-no" 
                            onChange={this.setFirstOrderNumber}
                            value={this.state.firstOrderNumber}></input><br />
                        Last:  <input id="last-order-no" 
                            onChange={this.setLastOrderNumber}
                            value={this.state.lastOrderNumber} ></input><br />
                        <button className="sales-by-region-action" onClick={this.filterByOrderNumber}>
                            Filter by range
                        </button>
                    </div> 

                </div>

                <div className="sales-by-region-spacer"></div>
                
                <div className="sales-by-region-emphasis">
                        {searchLabel}
                </div>

                <div className="sales-by-region-spacer"></div>

               
                {(typeof this.state.data.sales != 'undefined') ? 
                <TableDisplay heading="Sales Revenue Summary (excluding refunds) - Combined" 
                        sales={this.state.data.sales}
                        currency={storeCurrencySetting.symbol} {...this.state.data.sales}></TableDisplay> :
                 <h3>No Sales results for this date range. </h3>}

                
                {this.state.data.paymentMethods.map((method) => {
                    return (Array.isArray(this.state.data.salesByPaymentMethod[method].sales) 
                    && this.state.data.salesByPaymentMethod[method].sales.length == 0) ?
                    <h3 >No Sales results for this date range. </h3>  :
                    <TableDisplay heading={`Sales Revenue Summary (excluding refunds) - ${method}`} 
                    currency={storeCurrencySetting.symbol} 
                    sales={this.state.data.salesByPaymentMethod[method].sales}
                    ></TableDisplay>
                    
                })}
                

                   
                {/*(Array.isArray(this.state.data.lineListing) && this.state.data.lineListing.length == 0) ? 
                <h3>No details available. If you can see totals above this is probably an error. </h3> : 
                <LineListing heading="Revenue Details - Combined" currency={storeCurrencySetting.symbol} 
                lineListing={this.state.data.lineListing}></LineListing>*/} 

               
                {this.state.data.paymentMethods.map((method) => {
                    return this.state.data.salesByPaymentMethod[method].length == 0 ?
                    <h3>No Sales results for this date range. </h3> :
                    <LineListing heading={`Revenue Details - ${method}`} currency={storeCurrencySetting.symbol} 
                    lineListing={this.state.data.lineListingByPaymentMethod[method]}
                    ></LineListing> 
 

                })}


          
                {(Array.isArray(this.state.data.refunds) && this.state.data.refunds.length == 0) ? 
                <h3>No refunds were made in this date range. </h3> : 
                <Refunds currency={storeCurrencySetting.symbol} {...this.state.data}></Refunds>}  
            </Fragment>
        }
    }
}