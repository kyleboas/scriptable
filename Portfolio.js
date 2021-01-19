/******************************************************************************
 * Constants and Configurations
 *****************************************************************************/

// NOTE: This script uses the Cache script (https://github.com/yaylinda/scriptable/blob/main/Cache.js)
// Make sure to add the Cache script in Scriptable as well!

// Cache keys and default location
const CACHE_KEY_LAST_UPDATED = 'last_updated';
 
// Font name and size
const FONT_NAME = 'Helvetica';
const FONT_SIZE = 16;

// Colors
const COLORS = {
  bg0: '#FFF',
  bg1: '#F2F2F2',
  date: '#000',
  personalCalendar: '#000',
  workCalendar: '#000',
  weather: '#000',
  location: '#000',
  deviceStats: '#000',
};

 // TODO: PLEASE SET THESE VALUES
const CASH = '0';

// Stock 1 - IRBT
  const Symbol_One = 'IRBT';
  const QTY_One = '1';
  
// Stock 2 - PACB
  const Symbol_Two = 'PACB';
  const QTY_Two = '1';

var availble = CASH * QTY_One;
    log(availble)
  

// Whether or not to use a background image for the widget (if false, use gradient color)
const USE_BACKGROUND_IMAGE = false;

/******************************************************************************
 * Initial Setups
 *****************************************************************************/

// Import and setup Cache
const Cache = importModule('Cache');
const cache = new Cache('terminalWidget');

// Fetch data and create widget
const data = await fetchData();
const widget = createWidget(data);

// Set background image of widget, if flag is true
if (USE_BACKGROUND_IMAGE) {
  // Determine if our image exists and when it was saved.
  const files = FileManager.local();
  const path = files.joinPath(files.documentsDirectory(), 'terminal-widget-background');
  const exists = files.fileExists(path);

  // If it exists and we're running in the widget, use photo from cache
  if (exists && config.runsInWidget) {
    widget.backgroundImage = files.readImage(path);

  // If it's missing when running in the widget, use a gradient black/dark-gray background.
  } else if (!exists && config.runsInWidget) {
    const bgColor = new LinearGradient();
    bgColor.colors = [new Color("#29323c"), new Color("#1c1c1c")];
    bgColor.locations = [0.0, 1.0];
    widget.backgroundGradient = bgColor;

  // But if we're running in app, prompt the user for the image.
  } else if (config.runsInApp){
    const img = await Photos.fromLibrary();
    widget.backgroundImage = img;
    files.writeImage(path, img);
  }
}

if (config.runsInApp) {  
  widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();
/******************************************************************************
 * Main Functions (Widget and Data-Fetching)
 *****************************************************************************/

/**
 * Main widget function.
 * 
 * @param {} data The data for the widget to display
 */
function createWidget(data) {
  console.log(`Creating widget with data: ${JSON.stringify(data)}`);

  const widget = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color(COLORS.bg0), new Color(COLORS.bg1)];
  bgColor.locations = [0.0, 1.0];
  widget.backgroundGradient = bgColor;
  widget.setPadding(10, 50, 15, 10);

  const stack = widget.addStack();
  stack.layoutVertically();
  stack.spacing = 4;
  stack.size = new Size(320, 0);

  // Line 0 - Last Login
  const timeFormatter = new DateFormatter();
  timeFormatter.locale = "en";
  timeFormatter.useNoDateStyle();
  timeFormatter.useShortTimeStyle();
  

  const lastLoginLine = stack.addText(`Last updated ${timeFormatter.string(new Date())}`);
  lastLoginLine.textColor = Color.black();
  lastLoginLine.textOpacity = 0.7;
  lastLoginLine.font = new Font(FONT_NAME, 11);
    
   // Amount availble to invest
    const availbleLine = stack.addText(CASH);
  availbleLine.textColor = Color.black();
  availbleLine.font = new Font(FONT_NAME, FONT_SIZE);


 // Stock 1 

    // Stock #1
    const stockOneLine = stack.addText(`${Symbol_One} - `);
  stockOneLine.textColor = Color.black();
  stockOneLine.font = new Font(FONT_NAME, 13);

    // Stock #2
    const stockTwoLine = stack.addText(`${Symbol_Two} -`);
  stockTwoLine.textColor = Color.black();
  stockTwoLine.font = new Font(FONT_NAME, 13);
  
  
  return widget;
}

/**
 * Fetch pieces of data for the widget.
 */
async function fetchData() {

  // Get last data update time (and set)
  const lastUpdated = await getLastUpdated();
  cache.write(CACHE_KEY_LAST_UPDATED, new Date().getTime());


  return {
    lastUpdated,
  };
}

/******************************************************************************
 * Helper Functions
 *****************************************************************************/

async function queryStockData(symbol) {
  let url = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + symbol + "?modules=price"
  let req = new Request(url)
  return await req.loadJSON()
}

//-------------------------------------
// Misc. Helper Functions
//-------------------------------------

/**
 * Make a REST request and return the response
 * 
 * @param {*} url URL to make the request to
 * @param {*} headers Headers for the request
 */

/**
 * Get the last updated timestamp from the Cache.
 */
async function getLastUpdated() {
  let cachedLastUpdated = await cache.read(CACHE_KEY_LAST_UPDATED);

  if (!cachedLastUpdated) {
    cachedLastUpdated = new Date().getTime();
    cache.write(CACHE_KEY_LAST_UPDATED, cachedLastUpdated);
  }

  return cachedLastUpdated;
}
