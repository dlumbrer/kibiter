
export function getMetadashboard(es, kbnIndex, scope) {
    es.search({
        index: kbnIndex,
        body: {
            query: {
                match: {
                    _id: "metadashboard"
                }
            }
        }
    }).then(function (resp) {
        scope.$root.metadash = resp.hits.hits[0]._source.metadashboard;
        //Put the selected one in different color
        styleSelected(scope, scope.$root.metadash)
    })

    const styleSelected = (scope, metadash) => {
        scope.$root.selectedItem = undefined
        // Check if you are in dashboard section
        if (window.location.href.split("#/dashboard/")[1]) {
            let currentDash = window.location.href.split("#/dashboard/")[1].split('?')[0]
            metadash.some((item) => {
                if (item.type === "entry" && item.panel_id === currentDash) {
                    scope.$root.selectedItem = item
                } else if (item.type === "menu") {
                    item.dashboards.some((subitem) => {
                        if (subitem.type === "entry" && subitem.panel_id === currentDash) {
                            scope.$root.selectedItem = item
                            return true
                        }
                    })
                }
                if (scope.$root.selectedItem) {
                    return true
                }
            });
        }
    }

    es.search({
        index: kbnIndex,
        body: {
            query: {
                match: {
                    _id: "projectname"
                }
            }
        }
    }).then(function (resp) {
        if (resp.hits.hits[0]) {
            scope.$root.appTitleCustom = resp.hits.hits[0]._source.projectname.name;
        }
    })
}