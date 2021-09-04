// Import SCSS entry file so that webpack picks up changes
import './index.scss';
import {addFilter} from '@wordpress/hooks';
import {SalesByRegionReport} from "./components/SalesByRegionReport/SalesByRegionReport";


addFilter('woocommerce_admin_reports_list', 'sales-by-region', (reports) => {
    return [
        ...reports,
        {
            report: 'sales-by-region',
            title: 'Sales by Region',
            component: SalesByRegionReport
        },
    ];
});
