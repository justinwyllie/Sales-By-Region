# Sales By Region

A WooCommerce Extension

## Rationale

The requirement was for a report for financial (tax) purposes which would show revenue broken down by country. The built-in WooCommerce analytics did not meet the requirment because this system does not maintain a separate billing country for each transaction. For example; if a user places two orders in a given time period the first using Germany as a billing address and the second using the US the built-in analytics system will only record the US as the customer only has one record and it is overwritten with the last transaction. This is acceptable for sales analysis purposes but not for finanical (government) reporting.

Additionally the plugin will also show other useful information such as payment method. A summary is provided for EU, Rest of World and UK. Refunds made in the queried time period are shown separately.

## Installation and Use

To build the project npm run build. See package.json. I don't think you need the woocommerce-admin extension to use the project but I used it to get started. The installation, setup and initial code was taken from this excellent tutorial: https://gorohovsky.com/extending-woocommerce-javascript-react/


