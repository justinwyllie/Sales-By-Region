import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {TableCard, ReportFilters} from '@woocommerce/components';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings'; 
import apiFetch from '@wordpress/api-fetch';    

/*
https://gorohovsky.com/extending-woocommerce-javascript-react/
https://github.com/woocommerce/woocommerce-admin/blob/main/client/analytics/components/report-table/index.js 
*/

function DisplayError(props)
{
    return <p className="salesByRegionError">{props.message}</p>; 
}

class LineListing extends ReactComponent {

    constructor(props) {
        super(props);
        this.handleSort = this.handleSort.bind(this);
         
       const defaultSortColumn = 'completedDate';
       
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
    /* TODO sort by dates and display in preferred format */
    sort(data, column, sortOrder) {
        
        const appliedSortOrder = sortOrder === 'asc' ? 1 : -1;
        return data.sort((a, b) => {
                      
            let origA = a[column];
            let origB = b[column];
            if (column == "completedDate") 
            {
                a[column] = new Date(a[column]);
                b[column] = new Date(b[column]);  
            }
            
            if (a[column] > b[column]) 
            {
                if (column == "completedDate") 
                {
                    a[column] = origA;
                    b[column] = origB;    
                }
                return appliedSortOrder;    
            }
            
            if (a[column] < b[column]) 
            {
                if (column == "completedDate") 
                {
                    a[column] = origA;
                    b[column] = origB;    
                }
                return -1 * appliedSortOrder;
            }

            if (1==1) 
            {
                if (column == "completedDate") 
                {
                    a[column] = origA;
                    b[column] = origB;    
                }
                return 0;
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
            {key: 'order', label: 'Order Id', isLeftAligned: true, isSortable: false, required: true},
            {key: 'customer', label: 'Customer', isLeftAligned: true, isSortable: false, required: true},
            {key: 'completedDate', label: 'Capture Date (y-m-d)', isLeftAligned: false, isSortable: true, required: true},
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
                {key: 'order', display: link },
                {key: 'customer', display: lineListing.Name},
                {key: 'completedDate', display: lineListing.completedDate},
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
                    title="Revenue Details"
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
            {key: 'date', label: 'Date of refund (y-m-d)', isLeftAligned: true, isSortable: false, required: true},
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
                    rowsPerPage={1000}
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
            this.testRender();
        }   
    }    

    componentDidMount() {
        if (!this.state.error)
        {
            this.testRender();
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
                    title="Sales Revenue Summary (excluding refunds)"
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
            error: false
        };
        
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getQueryParameters = this.getQueryParameters.bind(this);
        this.prepareData = this.prepareData.bind(this);
    }

    componentDidMount()
    {
        this.fetchData(this.state.dateQuery);
    }

    fetchData(dateQuery) {

        if(!this.state.data.loading) this.setState({data: {loading: true}});
        const endPoints = {
             'salesByRegion': '/sales-by-region/v1/sales'
        };
        const queryParameters = this.getQueryParameters(dateQuery);
        const salesPath = endPoints.salesByRegion + queryParameters;

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
        data = {sales: salesDataParam.sales, refunds: salesDataParam.refunds, 
            lineListing: salesDataParam.lineListing };
        data.loading = false;
        
        return data;
    }

    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    handleDateChange(newQuery) {
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
        this.fetchData(newDateQuery);
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

        if (this.state.error) 
        { 
             return <DisplayError message="Sorry. An error has occurred. Please try again later."></DisplayError> 
        } 
        else if (this.state.data.loading) 
        {
            return <p>Waiting...</p>    
        }
        else
        {
            return <Fragment>
                {reportFilters}   
                {(Array.isArray(this.state.data.sales) && this.state.data.sales.length == 0) ? 
                <h2>No Sales results for this date range. </h2> : 
                <TableDisplay currency={storeCurrencySetting.symbol} {...this.state.data}></TableDisplay>}

                {(Array.isArray(this.state.data.lineListing) && this.state.data.lineListing.length == 0) ? 
                <h2>No details available. If you can see totals above this is probably an error. </h2> : 
                <LineListing currency={storeCurrencySetting.symbol} {...this.state.data}></LineListing>} 

                {(Array.isArray(this.state.data.refunds) && this.state.data.refunds.length == 0) ? 
                <h2>No refunds were made in this date range. </h2> : 
                <Refunds currency={storeCurrencySetting.symbol} {...this.state.data}></Refunds>}  
            </Fragment>
        }
    }
}