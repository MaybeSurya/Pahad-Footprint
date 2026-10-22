$html = Get-Content 'index.html' -Raw

$checks = @(
    @{Name='navigate function';     Pat='function navigate(page)'},
    @{Name='calculate function';    Pat='function calculate()'},
    @{Name='renderTable function';  Pat='function renderTable()'},
    @{Name='setAdminMode function'; Pat='function setAdminMode()'},
    @{Name='setUserMode function';  Pat='function setUserMode()'},
    @{Name='showToast function';    Pat='function showToast('},
    @{Name='handleExportCSV';       Pat='function handleExportCSV()'},
    @{Name='handlePublishFactors';  Pat='function handlePublishFactors()'},
    @{Name='confirmPublish';        Pat='function confirmPublish()'},
    @{Name='handleSaveTrip';        Pat='function handleSaveTrip()'},
    @{Name='loadSampleItinerary';   Pat='function loadSampleItinerary()'},
    @{Name='handlePledge';          Pat='function handlePledge()'},
    @{Name='page-calculator';       Pat='id="page-calculator"'},
    @{Name='page-admin';            Pat='id="page-admin"'},
    @{Name='page-admin-trips';      Pat='id="page-admin-trips"'},
    @{Name='page-admin-factors';    Pat='id="page-admin-factors"'},
    @{Name='page-admin-partners';   Pat='id="page-admin-partners"'},
    @{Name='page-methodology';      Pat='id="page-methodology"'},
    @{Name='page-restoration';      Pat='id="page-restoration"'},
    @{Name='admin-ribbon';          Pat='id="admin-ribbon"'},
    @{Name='publish-modal';         Pat='id="publish-modal"'},
    @{Name='toast element';         Pat='id="toast"'},
    @{Name='audit-table-body';      Pat='id="audit-table-body"'},
    @{Name='metric-per-person';     Pat='id="metric-per-person"'},
    @{Name='metric-whole-trip';     Pat='id="metric-whole-trip"'},
    @{Name='impact-badge';          Pat='id="impact-badge"'},
    @{Name='swap-headline';         Pat='id="swap-headline"'},
    @{Name='breakdown-bar';         Pat='id="breakdown-bar"'},
    @{Name='data-mode transport';   Pat='data-mode="suv"'},
    @{Name='data-stay pills';       Pat='data-stay="9.0"'},
    @{Name='data-terrain buttons';  Pat='data-terrain="1.25"'},
    @{Name='filter-pill class';     Pat='filter-pill'},
    @{Name='main.css stylesheet';   Pat='src/styles/main.css'},
    @{Name='Google Fonts Inter';    Pat='fonts.googleapis.com'},
    @{Name='text/csv export';       Pat='text/csv'},
    @{Name='eco-habit credit-water';Pat='id="credit-water"'},
    @{Name='eco-habit credit-food'; Pat='id="credit-food"'},
    @{Name='save-trip-btn';         Pat='id="save-trip-btn"'},
    @{Name='distance-range slider'; Pat='id="distance-range"'},
    @{Name='nights-range slider';   Pat='id="nights-range"'},
    @{Name='passenger stepper dec'; Pat='id="passenger-dec"'},
    @{Name='route-preset select';   Pat='id="route-preset"'},
    @{Name='KPI 1482 trips';        Pat='1,482'},
    @{Name='KPI 214.8 carbon';      Pat='214.8'},
    @{Name='KPI 9780 saplings';     Pat='9,780'},
    @{Name='Circuit Kumaon 68.0t';  Pat='68.0 t'},
    @{Name='Transport SUV 46%';     Pat='46%'},
    @{Name='TripData PF-4092';      Pat='PF-4092'},
    @{Name='Formula breakdown';     Pat='formula-transport'}
)

$pass = 0; $fail = 0
foreach ($c in $checks) {
    if ($html.Contains($c.Pat)) {
        Write-Host "  PASS: $($c.Name)" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "  FAIL: $($c.Name)" -ForegroundColor Red
        $fail++
    }
}

Write-Host ""
Write-Host "========================"
Write-Host "TOTAL: $pass PASSED | $fail FAILED"
Write-Host "========================"
