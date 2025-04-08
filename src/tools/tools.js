import ReactGA4 from 'react-ga4'
export const eventSenderGA = (category, action, label) => {
    ReactGA4.event(
        {
            category, action, label
        }
    )
}

// category -> Paging, Submit
// action : ex. Click Test Start Button
// label : ex. 어디에서? Intro, Result, etc...