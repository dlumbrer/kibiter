
export function customMenu($scope) {
    $scope.showInfo = function (item) {
        if (item.type === "entry") {
            $scope.showNewMenu = false;
            window.location.replace(window.location.href.split("#")[0] + "#/dashboard/" + item.panel_id)
        } else if (item.type === "menu") {
            // If clicked in the same item
            if ($scope.parentDashboard === item) {
                $scope.showNewMenu = false;
                $scope.parentDashboard = undefined;
                return
            }
            $scope.showNewMenu = true;
            $scope.parentDashboard = item;
            // Divide in 4 columns
            let countItems = 0;
            $scope.currentPanelsons_fourth = []
            $scope.currentPanelsons_third = []
            $scope.currentPanelsons_second = []
            $scope.currentPanelsons_first = []
            item.dashboards.forEach(function (subitem) {
                if (countItems === 0) {
                    $scope.currentPanelsons_first.push(subitem)
                } else if (countItems === 1) {
                    $scope.currentPanelsons_second.push(subitem)
                } else if (countItems === 2) {
                    $scope.currentPanelsons_third.push(subitem)
                } else {
                    $scope.currentPanelsons_fourth.push(subitem)
                    countItems = 0;
                    return
                }
                countItems++
            });
        }
    }

    $scope.showDescription = (subitem) => {
        $scope.showDescriptionDiv = true;
        $scope.descriptionTitle = subitem.title;
        $scope.descriptionContent = subitem.description;
    }

    $scope.hideDescription = () => {
        $scope.showDescriptionDiv = false;
    }
}