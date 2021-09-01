// Import SCSS entry file so that webpack picks up changes
import './index.scss';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {SalesByRegionReport} from "./components/SalesByRegionReport/SalesByRegionReport";


addFilter('woocommerce_admin_reports_list', 'sales-by-region', (reports) => {
    return [
        ...reports,
        {
            report: 'sales-by-region',
            title: __('Sales by Region', 'sales-by-region'),
            component: SalesByRegionReport
        },
    ];
});
