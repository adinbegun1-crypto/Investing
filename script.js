const screens = [...document.querySelectorAll('.panel')];
const loginForm = document.getElementById('login-form');
const questionnaireForm = document.getElementById('questionnaire-form');
const analysisForm = document.getElementById('analysis-form');
const starterOutput = document.getElementById('starter-output');
const analysisOutput = document.getElementById('analysis-output');
const profileOutput = document.getElementById('profile-output');
const profileStatus = document.getElementById('profile-status');

const SUPABASE_URL = window.SUPABASE_URL || 'https://aormwwpaulpcvkezcamh.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_I2XKUAvXUVT12E7rYnEOtw_2g9zdKzh';
const supabaseClient = window.supabase?.createClient &&
  !SUPABASE_URL.includes('YOUR_PROJECT') &&
  !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const SEVERITY_WEIGHTS = {
  high: 15,
  'medium/high': 11,
  medium: 8,
  'low/medium': 5,
  useful: 2,
};

const SEVERITY_STYLES = {
  high: 'severity-high',
  'medium/high': 'severity-medium-high',
  medium: 'severity-medium',
  'low/medium': 'severity-low-medium',
  useful: 'severity-useful',
};

const PALETTE = ['#38bdf8', '#34d399', '#f59e0b', '#f472b6', '#818cf8', '#f87171', '#a3e635'];

const ETF_LIBRARY = [
  ['VOO', 'Vanguard S&P 500 ETF', 'us-large-cap-index', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.31, Financials: 0.13, Healthcare: 0.12, ConsumerDiscretionary: 0.1, CommunicationServices: 0.09, Industrials: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.02, RealEstate: 0.02 }, ['VANGUARD S&P 500', 'S&P500', 'SP500']],
  ['SPY', 'SPDR S&P 500 ETF Trust', 'us-large-cap-index', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.31, Financials: 0.13, Healthcare: 0.12, ConsumerDiscretionary: 0.1, CommunicationServices: 0.09, Industrials: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.02, RealEstate: 0.02 }],
  ['IVV', 'iShares Core S&P 500 ETF', 'us-large-cap-index', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.31, Financials: 0.13, Healthcare: 0.12, ConsumerDiscretionary: 0.1, CommunicationServices: 0.09, Industrials: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.02, RealEstate: 0.02 }],
  ['VTI', 'Vanguard Total Stock Market ETF', 'us-total-market', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.29, Financials: 0.13, Healthcare: 0.11, ConsumerDiscretionary: 0.1, Industrials: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.03, RealEstate: 0.03 }],
  ['ITOT', 'iShares Core S&P Total U.S. Stock Market ETF', 'us-total-market', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.29, Financials: 0.13, Healthcare: 0.11, ConsumerDiscretionary: 0.1, Industrials: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.03, RealEstate: 0.03 }],
  ['SCHB', 'Schwab U.S. Broad Market ETF', 'us-total-market', ['broad-us-etf', 'all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 0.29, Financials: 0.13, Healthcare: 0.11, ConsumerDiscretionary: 0.1, Industrials: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.06, Energy: 0.04, Utilities: 0.03, Materials: 0.03, RealEstate: 0.03 }],
  ['QQQ', 'Invesco QQQ Trust', 'nasdaq-growth', ['growth-etf'], { equities: 1 }, { 'United States': 0.95, International: 0.05 }, { Technology: 0.5, CommunicationServices: 0.16, ConsumerDiscretionary: 0.14, Healthcare: 0.06, Industrials: 0.05, ConsumerStaples: 0.03, Utilities: 0.02, Financials: 0.02, Materials: 0.01, Energy: 0.01 }],
  ['VGT', 'Vanguard Information Technology ETF', 'technology-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.98, International: 0.02 }, { Technology: 1 }],
  ['XLK', 'Technology Select Sector SPDR Fund', 'technology-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Technology: 1 }],
  ['XLF', 'Financial Select Sector SPDR Fund', 'financials-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Financials: 1 }],
  ['XLV', 'Health Care Select Sector SPDR Fund', 'healthcare-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Healthcare: 1 }],
  ['XLE', 'Energy Select Sector SPDR Fund', 'energy-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Energy: 1 }],
  ['XLI', 'Industrial Select Sector SPDR Fund', 'industrials-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Industrials: 1 }],
  ['XLP', 'Consumer Staples Select Sector SPDR Fund', 'consumer-staples-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { ConsumerStaples: 1 }],
  ['XLY', 'Consumer Discretionary Select Sector SPDR Fund', 'consumer-discretionary-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { ConsumerDiscretionary: 1 }],
  ['XLC', 'Communication Services Select Sector SPDR Fund', 'communication-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { CommunicationServices: 1 }],
  ['XLU', 'Utilities Select Sector SPDR Fund', 'utilities-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Utilities: 1 }],
  ['XLB', 'Materials Select Sector SPDR Fund', 'materials-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Materials: 1 }],
  ['XLRE', 'Real Estate Select Sector SPDR Fund', 'real-estate-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { RealEstate: 1 }],
  ['VT', 'Vanguard Total World Stock ETF', 'global-total-market', ['all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.62, International: 0.38 }, { Technology: 0.24, Financials: 0.16, Industrials: 0.11, ConsumerDiscretionary: 0.1, Healthcare: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.07, Energy: 0.05, Materials: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VXUS', 'Vanguard Total International Stock ETF', 'international-total-market', ['international-core'], { equities: 1 }, { International: 0.98, 'United States': 0.02 }, { Financials: 0.2, Industrials: 0.14, Technology: 0.13, ConsumerDiscretionary: 0.12, Healthcare: 0.09, Materials: 0.09, ConsumerStaples: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VEA', 'Vanguard FTSE Developed Markets ETF', 'international-developed', ['international-core'], { equities: 1 }, { International: 0.97, 'United States': 0.03 }, { Financials: 0.2, Industrials: 0.16, Healthcare: 0.11, ConsumerDiscretionary: 0.11, Technology: 0.1, ConsumerStaples: 0.09, Materials: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VWO', 'Vanguard FTSE Emerging Markets ETF', 'emerging-markets', ['international-core'], { equities: 1 }, { International: 0.99, 'United States': 0.01 }, { Technology: 0.24, Financials: 0.21, ConsumerDiscretionary: 0.14, CommunicationServices: 0.1, Industrials: 0.08, Materials: 0.07, ConsumerStaples: 0.06, Energy: 0.05, Healthcare: 0.04, Utilities: 0.01 }],
  ['BND', 'Vanguard Total Bond Market ETF', 'core-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 0.9, International: 0.1 }, { Bonds: 1 }],
  ['AGG', 'iShares Core U.S. Aggregate Bond ETF', 'core-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 0.9, International: 0.1 }, { Bonds: 1 }],
  ['BNDX', 'Vanguard Total International Bond ETF', 'international-bonds', ['bond-core'], { bonds: 1 }, { International: 0.98, 'United States': 0.02 }, { Bonds: 1 }],
  ['SCHD', 'Schwab U.S. Dividend Equity ETF', 'us-dividend-equity', ['dividend'], { equities: 1 }, { 'United States': 0.97, International: 0.03 }, { Financials: 0.19, Healthcare: 0.16, Technology: 0.14, Industrials: 0.13, ConsumerStaples: 0.11, Energy: 0.09, ConsumerDiscretionary: 0.07, CommunicationServices: 0.04, Utilities: 0.03, Materials: 0.02, RealEstate: 0.02 }],
  ['DGRO', 'iShares Core Dividend Growth ETF', 'dividend-growth', ['dividend'], { equities: 1 }, { 'United States': 0.96, International: 0.04 }, { Technology: 0.2, Financials: 0.17, Healthcare: 0.15, Industrials: 0.12, ConsumerStaples: 0.09, ConsumerDiscretionary: 0.09, Energy: 0.07, CommunicationServices: 0.05, Utilities: 0.03, Materials: 0.02, RealEstate: 0.01 }],
  ['VYM', 'Vanguard High Dividend Yield ETF', 'dividend-income', ['dividend'], { equities: 1 }, { 'United States': 0.95, International: 0.05 }, { Financials: 0.19, Healthcare: 0.14, ConsumerStaples: 0.13, Industrials: 0.13, Technology: 0.12, Energy: 0.08, Utilities: 0.06, ConsumerDiscretionary: 0.06, CommunicationServices: 0.05, Materials: 0.02, RealEstate: 0.02 }],
  ['VNQ', 'Vanguard Real Estate ETF', 'reit', ['real-estate'], { realEstate: 1 }, { 'United States': 0.97, International: 0.03 }, { RealEstate: 1 }],
  ['GLD', 'SPDR Gold Shares', 'gold', ['commodity'], { alternatives: 1 }, { International: 0.6, 'United States': 0.4 }, { Commodities: 1 }],
  ['IAU', 'iShares Gold Trust', 'gold', ['commodity'], { alternatives: 1 }, { International: 0.6, 'United States': 0.4 }, { Commodities: 1 }],
  ['TIP', 'iShares TIPS Bond ETF', 'inflation-protected-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 1 }, { Bonds: 1 }],
  ['BIL', 'SPDR Bloomberg 1-3 Month T-Bill ETF', 'ultra-short-treasury', ['bond-core', 'cash-equivalent'], { cash: 0.75, bonds: 0.25 }, { 'United States': 1 }, { Bonds: 1 }],
  ['SGOV', 'iShares 0-3 Month Treasury Bond ETF', 'ultra-short-treasury', ['bond-core', 'cash-equivalent'], { cash: 0.75, bonds: 0.25 }, { 'United States': 1 }, { Bonds: 1 }],
  ['SHY', 'iShares 1-3 Year Treasury Bond ETF', 'short-duration-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 1 }, { Bonds: 1 }],
  ['ACWI', 'iShares MSCI ACWI ETF', 'global-total-market', ['all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.62, International: 0.38 }, { Technology: 0.24, Financials: 0.16, Industrials: 0.11, ConsumerDiscretionary: 0.1, Healthcare: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.07, Energy: 0.05, Materials: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['EFA', 'iShares MSCI EAFE ETF', 'international-developed', ['international-core'], { equities: 1 }, { International: 0.97, 'United States': 0.03 }, { Financials: 0.2, Industrials: 0.16, Healthcare: 0.11, ConsumerDiscretionary: 0.11, Technology: 0.1, ConsumerStaples: 0.09, Materials: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['EEM', 'iShares MSCI Emerging Markets ETF', 'emerging-markets', ['international-core'], { equities: 1 }, { International: 0.99, 'United States': 0.01 }, { Technology: 0.24, Financials: 0.21, ConsumerDiscretionary: 0.14, CommunicationServices: 0.1, Industrials: 0.08, Materials: 0.07, ConsumerStaples: 0.06, Energy: 0.05, Healthcare: 0.04, Utilities: 0.01 }],
  ['IWF', 'iShares Russell 1000 Growth ETF', 'us-growth-style', ['growth-etf', 'thematic-etf'], { equities: 1 }, { 'United States': 0.98, International: 0.02 }, { Technology: 0.44, CommunicationServices: 0.14, ConsumerDiscretionary: 0.14, Healthcare: 0.09, Industrials: 0.06, Financials: 0.05, ConsumerStaples: 0.03, Energy: 0.02, Utilities: 0.01, Materials: 0.01, RealEstate: 0.01 }],
  ['SOXX', 'iShares Semiconductor ETF', 'semiconductor-theme', ['sector-etf', 'thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.85, International: 0.15 }, { Technology: 1 }],
  ['SMH', 'VanEck Semiconductor ETF', 'semiconductor-theme', ['sector-etf', 'thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.83, International: 0.17 }, { Technology: 1 }],
  ['ARKK', 'ARK Innovation ETF', 'innovation-theme', ['thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.9, International: 0.1 }, { Technology: 0.42, Healthcare: 0.22, CommunicationServices: 0.12, ConsumerDiscretionary: 0.12, Industrials: 0.07, Financials: 0.05 }],
  ['IBIT', 'iShares Bitcoin Trust ETF', 'bitcoin-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['FBTC', 'Fidelity Wise Origin Bitcoin Fund', 'bitcoin-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['ETHA', 'iShares Ethereum Trust ETF', 'ethereum-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['CASH', 'Cash', 'cash', ['cash-equivalent'], { cash: 1 }, { 'United States': 1 }, { Cash: 1 }, ['USD', 'MONEY MARKET', 'CASH RESERVE']],
];

const STOCK_LIBRARY = [
  ['AAPL', 'Apple', 'Technology', 'United States', ['APPLE INC']],
  ['MSFT', 'Microsoft', 'Technology', 'United States'],
  ['NVDA', 'NVIDIA', 'Technology', 'United States'],
  ['GOOGL', 'Alphabet Class A', 'CommunicationServices', 'United States', ['GOOG', 'ALPHABET']],
  ['AMZN', 'Amazon', 'ConsumerDiscretionary', 'United States'],
  ['META', 'Meta Platforms', 'CommunicationServices', 'United States', ['FACEBOOK']],
  ['TSLA', 'Tesla', 'ConsumerDiscretionary', 'United States'],
  ['BRK.B', 'Berkshire Hathaway Class B', 'Financials', 'United States', ['BRKB', 'BRK-B', 'BERKSHIRE']],
  ['JPM', 'JPMorgan Chase', 'Financials', 'United States'],
  ['BAC', 'Bank of America', 'Financials', 'United States'],
  ['WFC', 'Wells Fargo', 'Financials', 'United States'],
  ['V', 'Visa', 'Financials', 'United States'],
  ['MA', 'Mastercard', 'Financials', 'United States'],
  ['GS', 'Goldman Sachs', 'Financials', 'United States'],
  ['JNJ', 'Johnson & Johnson', 'Healthcare', 'United States'],
  ['UNH', 'UnitedHealth Group', 'Healthcare', 'United States'],
  ['PFE', 'Pfizer', 'Healthcare', 'United States'],
  ['LLY', 'Eli Lilly', 'Healthcare', 'United States'],
  ['MRK', 'Merck', 'Healthcare', 'United States'],
  ['ABBV', 'AbbVie', 'Healthcare', 'United States'],
  ['XOM', 'Exxon Mobil', 'Energy', 'United States'],
  ['CVX', 'Chevron', 'Energy', 'United States'],
  ['COP', 'ConocoPhillips', 'Energy', 'United States'],
  ['SLB', 'Schlumberger', 'Energy', 'United States'],
  ['KO', 'Coca-Cola', 'ConsumerStaples', 'United States'],
  ['PEP', 'PepsiCo', 'ConsumerStaples', 'United States'],
  ['PG', 'Procter & Gamble', 'ConsumerStaples', 'United States'],
  ['WMT', 'Walmart', 'ConsumerStaples', 'United States'],
  ['COST', 'Costco', 'ConsumerStaples', 'United States'],
  ['HD', 'Home Depot', 'ConsumerDiscretionary', 'United States'],
  ['MCD', 'McDonald\'s', 'ConsumerDiscretionary', 'United States'],
  ['NKE', 'Nike', 'ConsumerDiscretionary', 'United States'],
  ['SBUX', 'Starbucks', 'ConsumerDiscretionary', 'United States'],
  ['DIS', 'Walt Disney', 'CommunicationServices', 'United States'],
  ['NFLX', 'Netflix', 'CommunicationServices', 'United States'],
  ['T', 'AT&T', 'CommunicationServices', 'United States'],
  ['VZ', 'Verizon', 'CommunicationServices', 'United States'],
  ['CSCO', 'Cisco', 'Technology', 'United States'],
  ['ORCL', 'Oracle', 'Technology', 'United States'],
  ['CRM', 'Salesforce', 'Technology', 'United States'],
  ['ADBE', 'Adobe', 'Technology', 'United States'],
  ['INTC', 'Intel', 'Technology', 'United States'],
  ['AMD', 'Advanced Micro Devices', 'Technology', 'United States'],
  ['QCOM', 'Qualcomm', 'Technology', 'United States'],
  ['AVGO', 'Broadcom', 'Technology', 'United States'],
  ['IBM', 'IBM', 'Technology', 'United States'],
  ['TXN', 'Texas Instruments', 'Technology', 'United States'],
  ['CAT', 'Caterpillar', 'Industrials', 'United States'],
  ['GE', 'GE Aerospace', 'Industrials', 'United States'],
  ['HON', 'Honeywell', 'Industrials', 'United States'],
  ['UPS', 'United Parcel Service', 'Industrials', 'United States'],
  ['UNP', 'Union Pacific', 'Industrials', 'United States'],
  ['LMT', 'Lockheed Martin', 'Industrials', 'United States'],
  ['BA', 'Boeing', 'Industrials', 'United States'],
  ['DE', 'Deere', 'Industrials', 'United States'],
  ['NEE', 'NextEra Energy', 'Utilities', 'United States'],
  ['DUK', 'Duke Energy', 'Utilities', 'United States'],
  ['SO', 'Southern Company', 'Utilities', 'United States'],
  ['PLD', 'Prologis', 'RealEstate', 'United States'],
  ['AMT', 'American Tower', 'RealEstate', 'United States'],
  ['O', 'Realty Income', 'RealEstate', 'United States'],
  ['SPG', 'Simon Property Group', 'RealEstate', 'United States'],
  ['LIN', 'Linde', 'Materials', 'United States'],
  ['APD', 'Air Products and Chemicals', 'Materials', 'United States'],
  ['NEM', 'Newmont', 'Materials', 'United States'],
  ['RIO', 'Rio Tinto', 'Materials', 'International'],
  ['BABA', 'Alibaba', 'ConsumerDiscretionary', 'International'],
  ['TSM', 'Taiwan Semiconductor', 'Technology', 'International'],
  ['ASML', 'ASML Holding', 'Technology', 'International'],
  ['SAP', 'SAP', 'Technology', 'International'],
  ['SONY', 'Sony Group', 'ConsumerDiscretionary', 'International'],
  ['TM', 'Toyota Motor', 'ConsumerDiscretionary', 'International'],
  ['NVO', 'Novo Nordisk', 'Healthcare', 'International'],
  ['UL', 'Unilever', 'ConsumerStaples', 'International'],
  ['BP', 'BP', 'Energy', 'International'],
  ['SHEL', 'Shell', 'Energy', 'International'],
  ['SHOP', 'Shopify', 'Technology', 'International'],
  ['SQ', 'Block', 'Financials', 'United States', ['BLOCK']],
  ['PYPL', 'PayPal', 'Financials', 'United States'],
  ['ROKU', 'Roku', 'CommunicationServices', 'United States'],
  ['UBER', 'Uber', 'Industrials', 'United States'],
  ['SNOW', 'Snowflake', 'Technology', 'United States'],
  ['PANW', 'Palo Alto Networks', 'Technology', 'United States'],
  ['CRWD', 'CrowdStrike', 'Technology', 'United States'],
  ['MELI', 'MercadoLibre', 'ConsumerDiscretionary', 'International'],
  ['SE', 'Sea Limited', 'CommunicationServices', 'International'],
];

const CRYPTO_LIBRARY = [
  ['BTC', 'Bitcoin', 'Crypto', 'International', ['BITCOIN', 'XBT']],
  ['ETH', 'Ethereum', 'Crypto', 'International', ['ETHER']],
  ['SOL', 'Solana', 'Crypto', 'International'],
  ['BNB', 'BNB', 'Crypto', 'International'],
  ['XRP', 'XRP', 'Crypto', 'International'],
  ['DOGE', 'Dogecoin', 'Crypto', 'International'],
  ['USDC', 'USD Coin', 'Cash', 'International', ['USD COIN']],
  ['USDT', 'Tether USD', 'Cash', 'International', ['TETHER']],
];

function toTitleLabel(value) {
  return String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\bEtf\b/g, 'ETF')
    .replace(/\bUs\b/g, 'U.S.')
    .trim();
}

function normalizeLookupKey(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[.\-_/]/g, '');
}

function deriveEtfCategory(strategyGroup, tags = []) {
  if (tags.includes('cash-equivalent')) return 'cash equivalent';
  if (tags.includes('bond-core') || strategyGroup.includes('bond')) return 'aggregate bonds';
  if (tags.includes('dividend')) return 'dividend';
  if (tags.includes('sector-etf')) return 'sector ETF';
  if (tags.includes('growth-etf')) return 'tech/growth';
  if (strategyGroup.includes('us-large-cap') || strategyGroup.includes('us-total-market')) return 'US large cap';
  if (strategyGroup.includes('global')) return 'global equity';
  if (strategyGroup.includes('international-developed')) return 'international developed';
  if (strategyGroup.includes('emerging')) return 'emerging markets';
  if (tags.includes('international-core')) return 'international equity';
  if (tags.includes('crypto-etf')) return 'crypto thematic';
  return 'broad ETF';
}

function buildMetadataIndexes() {
  const exact = {};
  const normalized = {};
  const table = [];

  ETF_LIBRARY.forEach(([symbol, name, strategyGroup, tags, assetClass, geography, sector, aliases = []]) => {
    const assetType = symbol === 'CASH' ? 'cash' : tags.includes('bond-core') ? 'bond fund' : 'ETF';
    const domicile = Object.entries(geography || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
    const entry = {
      symbol,
      name,
      type: symbol === 'CASH' ? 'cash' : 'etf',
      assetType,
      category: tags.includes('sector-etf') ? 'sector ETF' : tags.includes('bond-core') ? 'bond ETF' : tags.includes('cash-equivalent') ? 'cash' : 'ETF',
      etfCategory: deriveEtfCategory(strategyGroup, tags),
      strategyGroup,
      tags,
      assetClass,
      geography,
      domicile,
      sector,
      aliases,
      indexedExposure: tags.includes('broad-us-etf') || tags.includes('all-equity-broad-market'),
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType,
      sector: Object.keys(sector || {})[0] || 'Unknown',
      geography: domicile,
      etfKind: tags.includes('sector-etf') ? 'sector ETF' : tags.includes('thematic-etf') ? 'thematic ETF' : tags.includes('bond-core') ? 'bond ETF' : tags.includes('cash-equivalent') ? 'cash equivalent' : 'broad ETF',
      etfCategory: deriveEtfCategory(strategyGroup, tags),
      matchCoverage: 'exact + normalized',
    });
  });

  STOCK_LIBRARY.forEach(([symbol, name, sector, geography, aliases = []]) => {
    const entry = {
      symbol,
      name,
      type: 'stock',
      assetType: 'stock',
      category: 'single stock',
      strategyGroup: `single-stock-${normalizeLookupKey(symbol)}`,
      tags: ['single-stock'],
      assetClass: { equities: 1 },
      geography: { [geography]: 1 },
      domicile: geography,
      sector: { [sector]: 1 },
      aliases,
      indexedExposure: geography === 'United States',
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType: 'stock',
      sector,
      geography,
      etfKind: 'n/a',
      etfCategory: 'n/a',
      matchCoverage: 'exact + normalized',
    });
  });

  CRYPTO_LIBRARY.forEach(([symbol, name, sector, geography, aliases = []]) => {
    const entry = {
      symbol,
      name,
      type: 'crypto',
      assetType: 'crypto',
      category: 'crypto asset',
      strategyGroup: `crypto-${normalizeLookupKey(symbol)}`,
      tags: ['crypto-asset'],
      assetClass: { alternatives: 1 },
      geography: { [geography]: 1 },
      domicile: geography,
      sector: { [sector]: 1 },
      aliases,
      indexedExposure: false,
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType: 'crypto',
      sector,
      geography,
      etfKind: 'n/a',
      etfCategory: 'n/a',
      matchCoverage: 'exact + normalized',
    });
  });

  return { exact, normalized, table: table.sort((a, b) => a.ticker.localeCompare(b.ticker)) };
}

const SECURITY_INDEXES = buildMetadataIndexes();

function getSecurityMetadataTable() {
  return SECURITY_INDEXES.table;
}

const state = {
  login: null,
  questionnaire: null,
  portfolio: null,
};

function renderProfileData(profileRow) {
  if (!profileRow) {
    profileOutput.innerHTML = '<p>No profile data has been saved yet.</p>';
    return;
  }

  const questionnaire = profileRow.questionnaire || {};
  profileOutput.innerHTML = `
    <div class="breakdown-grid">
      <section class="sub-card">
        <h4>Login details</h4>
        <ul class="metric-list compact-list">
          <li><span>Email: ${profileRow.email || 'N/A'}</span></li>
          <li><span>Password: ${profileRow.password || 'N/A'}</span></li>
          <li><span>Newsletter opt-in: ${profileRow.newsletter_opt_in ? 'Yes' : 'No'}</span></li>
        </ul>
      </section>
      <section class="sub-card">
        <h4>Questionnaire answers</h4>
        <ul class="metric-list compact-list">
          ${Object.entries(questionnaire).map(([key, value]) => `<li><span>${toTitleLabel(key)}: ${value}</span></li>`).join('')}
        </ul>
      </section>
    </div>
  `;
}

async function saveProfileToSupabase() {
  if (!supabaseClient || !state.login || !state.questionnaire) {
    return;
  }

  const payload = {
    email: state.login.email,
    password: state.login.password,
    newsletter_opt_in: Boolean(state.login.newsletterOptIn),
    questionnaire: state.questionnaire,
  };

  const { error } = await supabaseClient.from('user_profiles').upsert(payload, { onConflict: 'email' });
  if (error) {
    profileStatus.textContent = `Supabase save error: ${error.message}`;
    return;
  }
  profileStatus.textContent = 'Profile data saved to Supabase.';
}

async function loadProfileFromSupabase() {
  if (!state.login?.email) {
    profileStatus.textContent = 'Log in first to view your profile.';
    renderProfileData(null);
    return;
  }
  if (!supabaseClient) {
    profileStatus.textContent = 'Supabase is not configured. Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY before loading the app.';
    renderProfileData({
      email: state.login.email,
      password: state.login.password,
      newsletter_opt_in: Boolean(state.login.newsletterOptIn),
      questionnaire: state.questionnaire || {},
    });
    return;
  }

  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('email', state.login.email)
    .maybeSingle();

  if (error) {
    profileStatus.textContent = `Supabase load error: ${error.message}`;
    renderProfileData(null);
    return;
  }

  profileStatus.textContent = data ? 'Loaded profile from Supabase.' : 'No profile found in Supabase yet.';
  renderProfileData(data);
}

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function classifyStarterBucket(answers) {
  const age = Number(answers.age || 0);
  const horizon = answers.timeHorizon;
  const risk = answers.riskTolerance;
  const goal = answers.mainGoal;

  if (horizon === 'less than 3 years' || goal === 'save for big purchase') {
    return {
      key: 'short-term-investor',
      label: 'Short-term investor',
      style: 'Capital preservation portfolio',
      styleMessage: 'Your priority is protecting money you may need soon, so growth matters less than stability.',
      allocation: ['Low equity', 'High cash and/or bonds'],
      allocationMessage: 'Most of your portfolio should stay in safer assets because you may need the money soon.',
      investIn: ['High-interest cash', 'Short-term bond exposure', 'Lower-volatility holdings'],
      avoid: ['Aggressive stocks', 'Concentrated positions'],
    };
  }

  if (risk === 'high' && horizon === '7+ years' && goal === 'grow your wealth long term' && age <= 35) {
    return {
      key: 'aggressive-long-term-investor',
      label: 'Aggressive long-term investor',
      style: 'Simple long-term growth portfolio',
      styleMessage: 'Your profile supports a mostly equity-based strategy built for long-term compounding.',
      allocation: ['Very high or full equity exposure', 'Very little cash unless intentionally held'],
      allocationMessage: 'Your profile supports prioritizing long-term growth over short-term stability.',
      investIn: ['Broad all-equity ETF', 'A simple combination of U.S. + international equity ETFs'],
      avoid: ['Large idle cash balances unless intentional', 'Needlessly complex holdings'],
    };
  }

  if (risk === 'high' && horizon === '7+ years') {
    return {
      key: 'growth-investor',
      label: 'Growth investor',
      style: 'Growth-focused ETF portfolio',
      styleMessage: 'Because you have time and can tolerate volatility, a stock-heavy portfolio likely makes sense.',
      allocation: ['High equities', 'Little bonds/cash'],
      allocationMessage: 'Because your time horizon is long, equities can play the main role in your portfolio.',
      investIn: ['Broad equity ETFs', 'Strong international diversification', 'Little or no bond allocation depending on profile'],
      avoid: ['Too much idle cash', 'Overly conservative allocations for long-term money'],
    };
  }

  if (risk === 'medium' && (horizon === '3-7 years' || horizon === '7+ years')) {
    return {
      key: 'balanced-investor',
      label: 'Balanced investor',
      style: 'Balanced ETF portfolio',
      styleMessage: 'A diversified portfolio with both growth and stability may fit you best.',
      allocation: ['Meaningful equities', 'Moderate bonds/cash'],
      allocationMessage: 'This is a middle-ground portfolio that aims for growth without being too aggressive.',
      investIn: ['Broad U.S. equity ETF', 'International equity ETF', 'Bond ETF'],
      avoid: ['Overconcentration in one asset', 'Overcomplicating the portfolio'],
    };
  }

  if (risk === 'low') {
    return {
      key: 'conservative-investor',
      label: 'Conservative investor',
      style: 'Conservative diversified portfolio',
      styleMessage: 'You likely need some growth, but with a more stable mix that matches your comfort level.',
      allocation: ['Moderate equities', 'Meaningful bonds/cash'],
      allocationMessage: 'This gives you some growth while limiting large swings.',
      investIn: ['Broad stock ETFs', 'Bond ETFs', 'Simple diversified funds'],
      avoid: ['Very aggressive allocations', 'Concentrated single-stock positions'],
    };
  }

  return {
    key: 'balanced-investor',
    label: 'Balanced investor',
    style: 'Balanced ETF portfolio',
    styleMessage: 'A diversified portfolio with both growth and stability may fit you best.',
    allocation: ['Meaningful equities', 'Moderate bonds/cash'],
    allocationMessage: 'This is a middle-ground portfolio that aims for growth without being too aggressive.',
    investIn: ['Broad U.S. equity ETF', 'International equity ETF', 'Bond ETF'],
    avoid: ['Overconcentration in one asset', 'Overcomplicating the portfolio'],
  };
}

const STARTER_OPTION_LIBRARY = {
  'short-term-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'Focus on preserving capital rather than growth.',
      allocationLines: [
        'High-interest savings / cash equivalents.',
        'Short-term bond ETF (e.g., ZAG or BND).',
      ],
      examples: 'Examples: ZAG, BND.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use mostly safer assets with only optional equity exposure.',
      allocationLines: [
        '60–80% cash / short-term bonds.',
        '20–40% broad, stable equity ETF (optional depending on timeline).',
      ],
      examples: 'Examples: Bond ETF: ZAG, BND. Equity ETF (small portion): VTI.',
    },
  ],
  'conservative-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'Balanced ETF with built-in diversification.',
      allocationLines: ['Use a one-ticket balanced ETF to keep the portfolio stable and simple.'],
      examples: 'Examples: VBAL, XBAL.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Blend equities and bonds with a conservative tilt.',
      allocationLines: [
        '40–60% equities.',
        '40–60% bonds.',
        'Keep any stock picks very small.',
      ],
      examples: 'Examples: Equity ETFs: VFV, XEF. Bond ETFs: ZAG. Optional very small stock sleeve: JNJ, PG, IAU.',
    },
  ],
  'balanced-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'One all-in-one ETF.',
      allocationLines: ['Choose a diversified growth-and-bond mix in one fund.'],
      examples: 'Examples: VGRO, XGRO.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use a balanced split across equities and bonds.',
      allocationLines: [
        '60–80% equities.',
        '20–40% bonds.',
        'Keep stock tilts small and intentional.',
      ],
      examples: 'Examples: US equity: VTI or VFV. International: XEF. Bonds: ZAG. Small stock sleeve: GOOGL, MSFT, PG, IAU.',
    },
  ],
  'growth-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'All-equity ETF.',
      allocationLines: ['Keep the core simple with one global all-equity fund.'],
      examples: 'Examples: XEQT, VEQT.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use a high-equity allocation with regional diversification.',
      allocationLines: [
        '80–100% equities.',
        'Diversify across U.S., international, and emerging markets.',
      ],
      examples: 'Examples: US equity: VTI or VOO. International: XEF. Emerging markets: XEC. Stock ideas: GOOGL, MSFT, NVDA, ASML, IAU.',
    },
  ],
  'aggressive-long-term-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: '100% global equity ETF.',
      allocationLines: ['Use one broad all-equity ETF as the long-term compounding core.'],
      examples: 'Examples: XEQT, VEQT.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Very high equity with optional growth/conviction tilts.',
      allocationLines: [
        '90–100% equities.',
        'Heavier tilt toward growth / conviction ideas.',
      ],
      examples: 'Examples: Core ETFs: VTI, XEF. Growth ETF tilt: QQQ. Stock/alt ideas: GOOGL, ASML, NVDA, TSLA, BTC.',
    },
  ],
};

function buildStarterPlanSummary(answers) {
  const cash = Number(answers.currentCash || 0);
  const monthly = Number(answers.monthlyAmount || 0);
  const bucket = classifyStarterBucket(answers);
  const summary = `At age ${answers.age} in ${answers.country}, you are investing for ${answers.mainGoal} over a ${answers.timeHorizon} horizon with a ${answers.riskTolerance} risk profile. Because time horizon and risk tolerance matter most, your profile fits the ${bucket.label.toLowerCase()} bucket best.`;

  return {
    bucket,
    summary,
    options: STARTER_OPTION_LIBRARY[bucket.key] || STARTER_OPTION_LIBRARY['balanced-investor'],
    contributionSummary: `You said you can invest ${formatCurrency(monthly)} per month and currently have ${formatCurrency(cash)} available, so a simple repeatable structure matters more than chasing complexity early on.`,
  };
}

function renderStarterPlan(plan) {
  return `
    <div class="starter-stack">
      <section class="report-banner">
        <div>
          <p class="eyebrow small">Getting started investing</p>
          <h3>${plan.bucket.label}</h3>
          <p>${plan.summary}</p>
        </div>
        <div class="report-banner-meta">
          <span>${plan.bucket.style}</span>
        </div>
      </section>

      <section class="sub-card">
        <h4>Recommended style</h4>
        <p><strong>${plan.bucket.style}</strong></p>
        <p>${plan.bucket.styleMessage}</p>
      </section>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Suggested allocation</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.allocation.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
          <p>${plan.bucket.allocationMessage}</p>
        </section>
        <section class="sub-card">
          <h4>Profile fit</h4>
          <p>${plan.contributionSummary}</p>
          <p>Your biggest driver here is the combination of <strong>${plan.bucket.label.toLowerCase()}</strong> characteristics, especially your time horizon and risk tolerance.</p>
        </section>
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>What to invest in</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.investIn.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </section>
        <section class="sub-card">
          <h4>What not to lean on</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.avoid.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="breakdown-grid">
        ${plan.options.map((option) => `
          <section class="sub-card starter-option-card">
            <h4>${option.title}</h4>
            <p><strong>${option.focus}</strong></p>
            <ul class="metric-list compact-list">
              ${option.allocationLines.map((line) => `<li><span>${line}</span></li>`).join('')}
            </ul>
            <p>${option.examples}</p>
          </section>
        `).join('')}
      </div>
    </div>
  `;
}

function parseHoldings(holdingsText) {
  return String(holdingsText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*[—-]\s*([\$\d,.]+)$/);
      if (!match) {
        return { raw: line, symbol: '', amount: Number.NaN };
      }

      return {
        raw: line,
        symbol: match[1].trim().toUpperCase(),
        amount: Number(match[2].replace(/[\$,]/g, '').trim()),
      };
    });
}

function resolveSecurity(symbol, questionnaire = {}) {
  const exactSymbol = String(symbol || '').trim().toUpperCase();
  const normalizedSymbol = normalizeLookupKey(exactSymbol);

  if (SECURITY_INDEXES.exact[exactSymbol]) {
    return {
      ...SECURITY_INDEXES.exact[exactSymbol],
      matchLevel: 'exact',
      inputSymbol: exactSymbol,
    };
  }

  if (SECURITY_INDEXES.normalized[normalizedSymbol]) {
    return {
      ...SECURITY_INDEXES.normalized[normalizedSymbol],
      matchLevel: 'normalized',
      inputSymbol: exactSymbol,
    };
  }

  const assumedGeography = /UNITED STATES|USA|US/i.test(questionnaire.country || '') ? 'United States' : 'International';
  const looksLikeCrypto = /(BTC|XBT|ETH|SOL|BNB|XRP|DOGE|USDT|USDC)/i.test(exactSymbol);
  const looksLikeFund = /(ETF|FUND)$/i.test(exactSymbol) || exactSymbol.length > 5;
  const looksLikeBondFund = /(BOND|TREASURY|TIPS|AGG)/i.test(exactSymbol);

  return {
    symbol: exactSymbol || 'UNKNOWN',
    name: exactSymbol || 'Unknown security',
    type: looksLikeCrypto ? 'crypto' : looksLikeFund ? 'etf' : 'stock',
    assetType: looksLikeCrypto ? 'crypto' : looksLikeBondFund ? 'bond fund' : looksLikeFund ? 'ETF' : 'stock',
    category: looksLikeCrypto ? 'crypto asset' : looksLikeFund ? 'unclassified fund' : 'unclassified stock',
    etfCategory: looksLikeBondFund ? 'aggregate bonds' : looksLikeFund ? 'broad ETF' : 'n/a',
    strategyGroup: `fallback-${normalizedSymbol || 'unknown'}`,
    tags: looksLikeCrypto ? ['fallback-classification', 'crypto-asset'] : ['fallback-classification'],
    assetClass: looksLikeCrypto ? { alternatives: 1 } : looksLikeBondFund ? { bonds: 1 } : { equities: 1 },
    geography: { [assumedGeography]: 1 },
    domicile: assumedGeography,
    sector: looksLikeCrypto ? { Crypto: 1 } : { Unknown: 1 },
    aliases: [],
    indexedExposure: looksLikeFund && !looksLikeCrypto,
    matchLevel: 'fallback',
    inputSymbol: exactSymbol,
  };
}

function accumulateWeightedBreakdown(target, weights, value) {
  Object.entries(weights || {}).forEach(([key, weight]) => {
    target[key] = (target[key] || 0) + value * weight;
  });
}

function normalizeTotals(totals, totalValue) {
  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      weight: totalValue ? value / totalValue : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

function getAllocationWeight(items, name) {
  return items.find((item) => item.name === name)?.weight || 0;
}

function primaryBucket(items) {
  return items[0]?.name || 'Unknown';
}

const ARCHETYPE_PRIORITY = [
  'too-aggressive-for-timeline',
  'beginner-stock-picker',
  'concentrated-single-name-bet',
  'underinvested-long-term-investor',
  'redundant-etf-stack',
  'us-tech-heavy-growth-portfolio',
  'overcomplicated-beginner-portfolio',
  'balanced-diversified-portfolio',
];

const ARCHETYPE_LIBRARY = {
  'beginner-stock-picker': {
    label: 'Beginner stock picker',
    story: 'This portfolio is built mostly from individual stocks and lacks a diversified core, so performance depends too much on a small number of companies.',
    mainIssue: 'The biggest issue is not just concentration — it is the absence of a broad ETF foundation.',
    secondaryIssues: ['Fully or mostly U.S. exposure.', 'Higher company-specific risk.', 'Possible theme concentration.'],
    positives: ['You have already started investing.', 'You are holding more than one name.', 'There may be cash available to improve the structure.'],
    actions: ['Build a diversified ETF core first.', 'Reduce the percentage of the portfolio in individual stocks over time.', 'Add international diversification after the ETF core is established.'],
  },
  'concentrated-single-name-bet': {
    label: 'Concentrated single-name bet',
    story: 'A large portion of this portfolio is tied to one position, so results are being driven too heavily by a single holding.',
    mainIssue: 'The portfolio has an oversized position that creates unnecessary concentration risk.',
    secondaryIssues: ['Weaker diversification than the headline holdings count suggests.', 'Possible sector concentration.', 'Performance is tied to one company or fund.'],
    positives: ['You already have capital invested and something concrete to improve.', 'The portfolio can improve meaningfully with one or two focused changes.', 'New contributions can help dilute the oversized position over time.'],
    actions: ['Reduce the oversized holding closer to a more reasonable share of the portfolio.', 'Reallocate into broader diversified exposure.', 'Reassess whether this position size is intentional or accidental.'],
  },
  'us-tech-heavy-growth-portfolio': {
    label: 'U.S. tech heavy growth portfolio',
    story: 'This portfolio is built for growth, but much of that growth exposure is concentrated in U.S. tech rather than spread broadly.',
    mainIssue: 'The main risk is that the portfolio is effectively making one large bet on U.S. technology.',
    secondaryIssues: ['High U.S. concentration.', 'High sector concentration.', 'Possible overlap across similar growth holdings.'],
    positives: ['The portfolio does have a clear growth orientation.', 'You have already built exposure to long-term equity assets.', 'The structure can improve without giving up growth entirely.'],
    actions: ['Keep the growth orientation if it fits the profile, but reduce dependence on U.S. tech.', 'Add broader market and international exposure.', 'Make sure no single stock or sector dominates the portfolio.'],
  },
  'redundant-etf-stack': {
    label: 'Redundant ETF stack',
    story: 'This portfolio contains multiple funds with overlapping exposure, so it is more complicated than it needs to be without adding much diversification.',
    mainIssue: 'The main problem is redundancy, not lack of diversification.',
    secondaryIssues: ['Multiple funds may be tracking similar markets.', 'Complexity is higher than necessary.', 'Weight may be unintentionally concentrated despite many tickers.'],
    positives: ['You are already thinking in terms of diversified funds.', 'Most of the improvement can come from simplification rather than a full rebuild.', 'The portfolio likely already has a usable core hidden inside it.'],
    actions: ['Simplify into fewer core ETFs.', 'Remove overlapping funds that serve the same purpose.', 'Rebuild around a cleaner allocation structure.'],
  },
  'underinvested-long-term-investor': {
    label: 'Underinvested long-term investor',
    story: 'This profile supports long-term growth, but a large portion of the portfolio is sitting in cash or defensive assets.',
    mainIssue: 'The portfolio is too conservative for the stated horizon and risk tolerance.',
    secondaryIssues: ['Long-term growth potential may be reduced.', 'Allocation does not match the stated goals.', 'Cash may be creating drag.'],
    positives: ['The conservative allocation does provide stability.', 'You may already have liquidity available to improve the allocation.', 'A gradual plan can fix this without requiring a sudden all-in move.'],
    actions: ['Decide how much cash truly needs to stay liquid.', 'Gradually invest the excess into the target allocation.', 'Set up recurring contributions so the portfolio keeps moving toward its goal.'],
  },
  'too-aggressive-for-timeline': {
    label: 'Too aggressive for the timeline',
    story: 'This portfolio may be suitable for long-term growth, but it looks too aggressive for money that may be needed soon.',
    mainIssue: 'The portfolio’s risk level does not match the time horizon.',
    secondaryIssues: ['Equity exposure may be too high.', 'Volatility could be damaging if the money is needed on schedule.', 'Individual stocks may add extra instability.'],
    positives: ['You do already have invested assets rather than idle money only.', 'The portfolio can become more appropriate with a risk reset rather than a full restart.', 'Your holdings can still support future long-term investing in the right account or bucket.'],
    actions: ['Reduce risk and increase safety.', 'Increase safer holdings such as cash or bonds.', 'Focus on protecting capital rather than maximizing upside.'],
  },
  'overcomplicated-beginner-portfolio': {
    label: 'Overcomplicated beginner portfolio',
    story: 'This portfolio has more moving parts than necessary for a beginner and may be harder to manage than the investor needs.',
    mainIssue: 'Complexity is too high relative to the goal and experience level.',
    secondaryIssues: ['Overlapping holdings.', 'Hard-to-track allocation.', 'Unclear core structure.'],
    positives: ['You have already taken action and built a real portfolio.', 'The portfolio likely contains useful pieces that can be retained.', 'Simplifying can improve results and confidence at the same time.'],
    actions: ['Simplify into a small number of core positions.', 'Remove unnecessary overlap.', 'Use a cleaner ETF-based structure going forward.'],
  },
  'balanced-diversified-portfolio': {
    label: 'Balanced diversified portfolio',
    story: 'This portfolio already has a solid diversified base and broadly aligns with the investor’s profile.',
    mainIssue: 'There is no major structural problem, only smaller improvements.',
    secondaryIssues: ['Minor concentration or overlap may exist.', 'Allocation could be tuned slightly.', 'Consistency may matter more than changes.'],
    positives: ['The portfolio already has a usable diversified foundation.', 'The allocation broadly matches the stated profile.', 'You likely need discipline more than a major rebuild.'],
    actions: ['Keep the core structure in place.', 'Make only targeted improvements if needed.', 'Stay consistent with contributions and avoid unnecessary changes.'],
  },
};

function hasAnyTag(holding, tags) {
  return tags.some((tag) => holding.metadata.tags.includes(tag));
}

function scoreArchetypes(summary, groupedThemes, questionnaire, rules = []) {
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const bondsWeight = getAllocationWeight(summary.assetClassTotals, 'bonds');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const topHolding = summary.holdings[0];
  const topSector = summary.sectorTotals[0];
  const topGeography = summary.geographyTotals[0];
  const holdingCount = summary.holdings.length;
  const broadFoundationCount = summary.holdings.filter((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market', 'international-core'])).length;
  const overlappingBroadEtfs = summary.holdings.filter((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market'])).length;
  const singleStockHoldings = summary.holdings.filter((holding) => holding.metadata.type === 'stock');
  const singleStockWeight = singleStockHoldings.reduce((sum, holding) => sum + holding.weight, 0);
  const popularNames = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'GOOGL', 'NFLX'];
  const popularNameCount = singleStockHoldings.filter((holding) => popularNames.includes(holding.symbol)).length;
  const weakSectorDiversification = (topSector?.weight || 0) >= 0.35;
  const weakGeographyDiversification = (topGeography?.weight || 0) >= 0.8;
  const duplicateTheme = groupedThemes.some((theme) => theme.theme === 'overlap');
  const concentrationTheme = groupedThemes.some((theme) => theme.theme === 'concentration');
  const deploymentTheme = groupedThemes.some((theme) => theme.theme === 'deployment');
  const riskTheme = groupedThemes.some((theme) => theme.theme === 'risk-mismatch');
  const shortHorizon = questionnaire?.timeHorizon === 'less than 3 years' || questionnaire?.mainGoal === 'save for big purchase';
  const longHorizon = questionnaire?.timeHorizon === '7+ years';
  const beginner = questionnaire?.experience === 'beginner';
  const mediumOrHighRisk = ['medium', 'high'].includes(questionnaire?.riskTolerance);
  const topTwoHoldings = summary.holdings.slice(0, 2);
  const topTwoTechHeavy = topTwoHoldings.filter((holding) => ['Technology', 'CommunicationServices'].includes(holding.primarySector)).length >= Math.min(2, topTwoHoldings.length || 0);
  const lowIssueCount = groupedThemes.length <= 1 && (topHolding?.weight || 0) < 0.25;
  const hasInternationalDiversification = (summary.geographyTotals.find((item) => item.name === 'International')?.weight || 0) >= 0.15;
  const scores = {};

  if (shortHorizon && (equitiesWeight > 0.7 || singleStockWeight > 0.45)) {
    scores['too-aggressive-for-timeline'] = 100 + Math.round(equitiesWeight * 10);
  }

  if (broadFoundationCount === 0 && holdingCount >= 3 && holdingCount <= 6 && singleStockWeight >= 0.65 && (weakSectorDiversification || weakGeographyDiversification || popularNameCount >= 2)) {
    scores['beginner-stock-picker'] = 96 + Math.round(singleStockWeight * 10);
  }

  const weakDiversification = weakSectorDiversification || weakGeographyDiversification || singleStockWeight > 0.65;
  const pureOverlapPortfolio = duplicateTheme && singleStockWeight < 0.2;
  if (!pureOverlapPortfolio && topHolding && (topHolding.weight > 0.4 || (topHolding.weight > 0.25 && concentrationTheme && weakDiversification))) {
    scores['concentrated-single-name-bet'] = 94 + Math.round(topHolding.weight * 10);
  }

  if (longHorizon && mediumOrHighRisk && (cashWeight > 0.15 || equitiesWeight < 0.55 || deploymentTheme)) {
    scores['underinvested-long-term-investor'] = 92 + Math.round((cashWeight + Math.max(0, 0.55 - equitiesWeight)) * 10);
  }

  if (duplicateTheme && (overlappingBroadEtfs >= 2 || rules.some((rule) => rule.title.includes('redundant exposure')))) {
    scores['redundant-etf-stack'] = 90 + overlappingBroadEtfs;
  }

  if ((topGeography?.name === 'United States' && topGeography.weight > 0.75) && (topSector?.name === 'Technology' && topSector.weight > 0.35) && topTwoTechHeavy) {
    scores['us-tech-heavy-growth-portfolio'] = 88 + Math.round((topSector.weight + topGeography.weight) * 5);
  }

  if (beginner && holdingCount > 8 && (singleStockWeight > 0.35 || duplicateTheme)) {
    scores['overcomplicated-beginner-portfolio'] = 86 + Math.min(10, holdingCount - 8);
  }

  if (broadFoundationCount >= 1 && !riskTheme && !concentrationTheme && !deploymentTheme && hasInternationalDiversification && lowIssueCount) {
    scores['balanced-diversified-portfolio'] = 84;
  }

  return scores;
}

function classifyArchetype(summary, groupedThemes, questionnaire, rules = []) {
  const scores = scoreArchetypes(summary, groupedThemes, questionnaire, rules);
  const eligible = ARCHETYPE_PRIORITY.filter((key) => scores[key]);
  const primaryKey = eligible[0] || 'balanced-diversified-portfolio';
  const secondaryKey = eligible.find((key) => key !== primaryKey && scores[key] >= scores[primaryKey] - 12) || null;

  return {
    primary: { key: primaryKey, score: scores[primaryKey] || 80, ...ARCHETYPE_LIBRARY[primaryKey] },
    secondary: secondaryKey ? { key: secondaryKey, score: scores[secondaryKey], ...ARCHETYPE_LIBRARY[secondaryKey] } : null,
    label: secondaryKey ? `${ARCHETYPE_LIBRARY[primaryKey].label} + ${ARCHETYPE_LIBRARY[secondaryKey].label}` : ARCHETYPE_LIBRARY[primaryKey].label,
    diagnosis: ARCHETYPE_LIBRARY[primaryKey].story,
  };
}

function createRule(theme, severity, priorityScore, title, detail, recommendation) {
  return { theme, severity, priorityScore, title, detail, recommendation };
}

function pushRule(rules, condition, rule) {
  if (condition) {
    rules.push(rule);
  }
}

function groupRules(rules) {
  const grouped = {};
  rules.forEach((rule) => {
    if (!grouped[rule.theme]) {
      grouped[rule.theme] = { theme: rule.theme, priorityScore: 0, rules: [] };
    }
    grouped[rule.theme].rules.push(rule);
    grouped[rule.theme].priorityScore = Math.max(grouped[rule.theme].priorityScore, rule.priorityScore);
  });

  return Object.values(grouped)
    .map((group) => ({
      ...group,
      avgPriority: Math.round(group.rules.reduce((sum, rule) => sum + rule.priorityScore, 0) / group.rules.length),
      headline: group.rules[0]?.title || 'Theme',
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function generatePositiveSignals(summary, questionnaire) {
  const positives = [];
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const topSector = summary.sectorTotals[0];
  const topGeography = summary.geographyTotals[0];
  const broadCoreCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('broad-us-etf') || holding.metadata.tags.includes('all-equity-broad-market')).length;
  const matchedKnown = summary.matchStats.exact + summary.matchStats.normalized;
  const monthlyContribution = Number(questionnaire?.monthlyAmount || 0);

  if (broadCoreCount >= 1) {
    positives.push('You already have at least one broad ETF that can serve as a solid core holding.');
  }

  if (summary.holdings.length >= 4 && summary.holdings.length <= 20) {
    positives.push('Your number of holdings is still manageable, which makes the portfolio easier to monitor and improve.');
  }

  if (topSector && topSector.weight <= 0.35) {
    positives.push(`No single sector dominates the portfolio, with ${toTitleLabel(topSector.name)} as the largest at ${formatPercent(topSector.weight)}.`);
  }

  if (topGeography && topGeography.weight <= 0.65) {
    positives.push('Your geography mix is not overly tied to one region, which helps reduce country-specific risk.');
  }

  if (monthlyContribution > 0) {
    positives.push(`You entered ${formatCurrency(monthlyContribution)} as a monthly contribution, which is a strong long-term habit.`);
  }

  if (cashWeight > 0 && cashWeight <= 0.1) {
    positives.push(`Only ${formatPercent(cashWeight)} of the portfolio is in cash, so most of the account is already invested.`);
  }

  if (matchedKnown === summary.holdings.length) {
    positives.push('Every holding matched the metadata library cleanly, so the portfolio read is based on known sector and geography data.');
  }

  return positives.slice(0, 4);
}

function buildDeterministicActionSteps(summary, groupedThemes, primaryArchetype) {
  const hasEtfFoundation = summary.holdings.some((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market', 'international-core']));
  const largestHoldingWeight = summary.holdings[0]?.weight || 0;
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const shortHorizonMismatch = groupedThemes.some((theme) => theme.theme === 'risk-mismatch') && primaryArchetype.key === 'too-aggressive-for-timeline';
  const overlapMainIssue = primaryArchetype.key === 'redundant-etf-stack';
  const cashDragMainIssue = primaryArchetype.key === 'underinvested-long-term-investor';
  const actions = [...primaryArchetype.actions];

  if (!hasEtfFoundation) {
    actions.unshift('Build a diversified ETF core first.');
  }
  if (largestHoldingWeight > 0.25) {
    actions.splice(1, 0, 'Reduce the oversized holding closer to a more reasonable share of the portfolio.');
  }
  if (overlapMainIssue) {
    actions.unshift('Simplify and remove redundancy.');
  }
  if (cashDragMainIssue || cashWeight > 0.15) {
    actions.unshift('Decide how much cash is intentional, then invest the rest gradually.');
  }
  if (shortHorizonMismatch) {
    actions.unshift('Reduce risk and increase safety.');
  }
  if (primaryArchetype.key === 'balanced-diversified-portfolio') {
    actions.unshift('Keep the core structure and make only minor adjustments.');
  }

  return [...new Set(actions)].slice(0, 3);
}

function buildNarrative(summary, questionnaire, groupedThemes, positives, archetype) {
  const primaryArchetype = archetype.primary;
  const secondaryArchetype = archetype.secondary;
  const topHolding = summary.holdings[0];
  const topSector = summary.sectorTotals[0];
  const contextualSecondary = [...primaryArchetype.secondaryIssues];

  if (secondaryArchetype) {
    contextualSecondary.unshift(`Secondary archetype: ${secondaryArchetype.label}.`);
  }
  if (topHolding && !contextualSecondary.some((item) => item.includes(topHolding.symbol))) {
    contextualSecondary.push(`${topHolding.symbol} is currently the largest holding at ${formatPercent(topHolding.weight)}.`);
  }
  if (topSector && !contextualSecondary.some((item) => item.includes(toTitleLabel(topSector.name)))) {
    contextualSecondary.push(`${toTitleLabel(topSector.name)} is the largest sector at ${formatPercent(topSector.weight)}.`);
  }

  return {
    diagnosis: primaryArchetype.story,
    archetypeLabel: archetype.label,
    primaryArchetype,
    secondaryArchetype,
    profileFit: `Profile context: ${questionnaire?.riskTolerance || 'medium'} risk tolerance, ${questionnaire?.timeHorizon || 'long-term'} horizon, and goal of ${questionnaire?.mainGoal || 'long-term growth'}.`,
    mainIssue: primaryArchetype.mainIssue,
    secondaryIssues: contextualSecondary.slice(0, 3),
    whatWorking: [...primaryArchetype.positives, ...positives].slice(0, 3),
    actionSteps: buildDeterministicActionSteps(summary, groupedThemes, primaryArchetype),
  };
}

function computePortfolioHealth(groupedThemes, positives) {
  const topPenalty = groupedThemes.slice(0, 5).reduce((sum, theme) => {
    const themePenalty = theme.rules.reduce((acc, rule) => acc + (SEVERITY_WEIGHTS[rule.severity] || 4), 0);
    return sum + Math.min(24, themePenalty + Math.round((theme.priorityScore - 50) / 8));
  }, 0);

  const positiveOffset = Math.min(12, positives.length * 3);
  const score = Math.max(0, Math.min(100, Math.round(100 - topPenalty + positiveOffset)));
  const label = score >= 85 ? 'Strong' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : 'Needs attention';
  return { score, label };
}

function generateRules(summary, questionnaire) {
  const rules = [];
  const age = Number(questionnaire?.age || 0);
  const monthlyContribution = Number(questionnaire?.monthlyAmount || 0);
  const currentCashAvailable = Number(questionnaire?.currentCash || 0);
  const largestHolding = summary.holdings[0];
  const topGeography = summary.geographyTotals[0];
  const topSector = summary.sectorTotals[0];
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const bondsWeight = getAllocationWeight(summary.assetClassTotals, 'bonds');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const cashAndBondsWeight = cashWeight + bondsWeight;
  const holdingCount = summary.holdings.length;
  const broadUsEtfCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('broad-us-etf')).length;
  const allEquityBroadMarketCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('all-equity-broad-market')).length;
  const singleStockHoldings = summary.holdings.filter((holding) => holding.metadata.type === 'stock');
  const singleStockCount = singleStockHoldings.length;
  const onlySingleStocks = singleStockCount === holdingCount;
  const hasBroadEtf = summary.holdings.some((holding) => holding.metadata.tags.includes('broad-us-etf') || holding.metadata.tags.includes('all-equity-broad-market'));
  const duplicateStrategies = summary.strategyExposure.filter((item) => item.weight >= 0.2).length >= 2;
  const topTwoHoldings = summary.holdings.slice(0, 2);
  const topTwoSameSector = topTwoHoldings.length === 2 && topTwoHoldings[0].primarySector === topTwoHoldings[1].primarySector;
  const broadEtfPlusIndexedStocks = hasBroadEtf && singleStockHoldings.filter((holding) => holding.metadata.indexedExposure).length >= 2;
  const fallbackCount = summary.matchStats.fallback;
  const horizon = questionnaire?.timeHorizon;
  const risk = questionnaire?.riskTolerance;
  const goal = questionnaire?.mainGoal;

  if (largestHolding) {
    pushRule(rules, holdingCount === 1, createRule('concentration', 'high', 98, 'Single holding concentration is very high', `your portfolio has only one holding, so ${largestHolding.symbol} represents ${formatPercent(largestHolding.weight)} of the account.`, 'Add at least a few diversified building blocks so one holding does not determine nearly all of your outcome.'));
    pushRule(rules, holdingCount >= 2 && holdingCount <= 3, createRule('diversification', 'medium', 76, 'Portfolio breadth is limited', `you currently hold only ${holdingCount} positions, which leaves the portfolio exposed to company-specific surprises.`, 'Broaden the core with a diversified ETF or a few clearly different holdings.'));
    pushRule(rules, largestHolding.weight > 0.4, createRule('concentration', 'high', 94, 'Largest holding is above 40%', `${largestHolding.symbol} makes up ${formatPercent(largestHolding.weight)} of the portfolio, which is a high concentration risk.`, `Trim ${largestHolding.symbol} gradually or let other holdings catch up through new contributions.`));
    pushRule(rules, largestHolding.weight > 0.25 && largestHolding.weight <= 0.4, createRule('concentration', 'medium', 84, 'Largest holding is above 25%', `${largestHolding.symbol} represents ${formatPercent(largestHolding.weight)}, so one position is driving a lot of the outcome.`, 'Redirect new money toward other exposures so the portfolio becomes less dependent on one holding.'));
    pushRule(rules, largestHolding.weight > 0.15 && largestHolding.metadata.type === 'stock', createRule('concentration', 'low/medium', 67, 'A single stock is above 15%', `${largestHolding.symbol} is an individual stock at ${formatPercent(largestHolding.weight)}, which is a meaningful company-specific bet.`, 'Keep individual stocks as satellites around a diversified core unless this overweight is very intentional.'));
  }

  pushRule(rules, holdingCount > 30, createRule('overlap', 'medium', 68, 'Portfolio may be too crowded', `you hold ${holdingCount} positions, which can make the portfolio harder to monitor and may indicate overlapping ideas.`, 'Consolidate overlapping positions into fewer core holdings with clear jobs.'));
  pushRule(rules, holdingCount > 20 && holdingCount <= 30, createRule('overlap', 'low/medium', 56, 'You may have more holdings than you need', `at ${holdingCount} holdings, diversification may already be sufficient and complexity may be rising.`, 'Review whether each position adds something unique before adding more names.'));
  pushRule(rules, holdingCount <= 2 && holdingCount > 0 && singleStockCount === holdingCount, createRule('diversification', 'high', 92, 'One or two single stocks create a fragile portfolio', 'a portfolio built entirely from one or two individual stocks can swing sharply based on company-specific news.', 'Add a broad market ETF first, then decide how much room remains for stock ideas.'));
  pushRule(rules, onlySingleStocks && !hasBroadEtf, createRule('diversification', 'medium/high', 80, 'Portfolio relies only on single stocks', 'all current holdings are individual stocks and there is no broad ETF anchor to spread risk across more companies.', 'Use a broad ETF as the foundation and keep stock picks as a smaller sleeve.'));

  if (topGeography) {
    pushRule(rules, topGeography.weight > 0.8, createRule('diversification', 'high', 90, 'Geography exposure is heavily concentrated', `${topGeography.name} accounts for ${formatPercent(topGeography.weight)} of the portfolio.`, 'Add exposure to other regions if you want a broader all-market mix rather than a one-country bet.'));
    pushRule(rules, topGeography.weight > 0.65 && topGeography.weight <= 0.8, createRule('diversification', 'medium', 78, 'Geography exposure is somewhat concentrated', `${topGeography.name} is ${formatPercent(topGeography.weight)} of the portfolio, so regional diversification could improve.`, 'Consider adding a broad international fund or other geographic diversifier.'));
  }

  if (topSector) {
    pushRule(rules, topSector.weight > 0.5 && topTwoSameSector, createRule('concentration', 'high', 89, 'Your portfolio is heavily tied to one theme', `${toTitleLabel(topSector.name)} is ${formatPercent(topSector.weight)} of the portfolio and your top two holdings are both in that same sector.`, 'Reduce the theme concentration by trimming overlapping holdings or adding underrepresented sectors.'));
    pushRule(rules, topSector.weight > 0.5, createRule('concentration', 'high', 88, 'Sector exposure is above 50%', `${toTitleLabel(topSector.name)} makes up ${formatPercent(topSector.weight)} of the portfolio.`, 'Add positions in other sectors or use a broader fund so one market theme does not dominate the whole account.'));
    pushRule(rules, topSector.weight > 0.35 && topSector.weight <= 0.5, createRule('concentration', 'medium/high', 76, 'Sector exposure is above 35%', `${toTitleLabel(topSector.name)} is ${formatPercent(topSector.weight)} of the portfolio, so returns may be driven by one part of the market.`, 'Direct future purchases toward sectors that are currently much smaller in the portfolio.'));
  }

  pushRule(rules, broadEtfPlusIndexedStocks, createRule('overlap', 'medium', 74, 'You may have redundant exposure', 'you own a broad U.S. ETF and also multiple U.S. stocks that are probably already inside that index.', 'Decide whether the stock picks are intentional overweights; if not, simplify and lean more on the ETF.'));
  pushRule(rules, broadUsEtfCount >= 2, createRule('overlap', 'useful', 60, 'You hold multiple broad U.S. ETFs', 'owning two or more broad U.S. equity ETFs can create overlap without adding much diversification.', 'If the funds serve the same role, keep the one you prefer on simplicity, cost, or account location.'));
  pushRule(rules, allEquityBroadMarketCount >= 2, createRule('overlap', 'useful', 63, 'Multiple all-equity broad market ETFs overlap', 'two or more all-equity broad market ETFs often duplicate much of the same exposure.', 'Keeping one main all-equity fund usually makes the portfolio easier to maintain.'));
  pushRule(rules, duplicateStrategies, createRule('overlap', 'useful', 58, 'Strategy exposure appears duplicated', 'several holdings point to similar strategy buckets, so the lineup may be more complex than it needs to be.', 'Look for holdings that play nearly the same role and consolidate where appropriate.'));

  pushRule(rules, equitiesWeight >= 0.995 && risk === 'low', createRule('risk-mismatch', 'high', 92, '100% equities looks too aggressive for a low-risk profile', 'your portfolio is effectively all equities, but your questionnaire says your risk tolerance is low.', 'Add bonds or cash reserves so the portfolio better matches the amount of volatility you can tolerate.'));
  pushRule(rules, equitiesWeight >= 0.995 && risk === 'medium', createRule('risk-mismatch', 'medium', 74, '100% equities may be aggressive for a medium-risk profile', 'an all-equity portfolio can be more aggressive than many medium-risk investors expect.', 'Consider whether a modest bond or cash sleeve would make it easier to stay invested through drawdowns.'));
  pushRule(rules, risk === 'low' && equitiesWeight > 0.8, createRule('risk-mismatch', 'medium/high', 86, 'Allocation may not match a low-risk profile', `a low-risk profile paired with ${formatPercent(equitiesWeight)} in equities looks more aggressive than expected.`, 'Shift part of the portfolio toward bonds or cash-like holdings if stability matters more than maximum growth.'));
  pushRule(rules, risk === 'high' && cashAndBondsWeight > 0.35, createRule('risk-mismatch', 'medium/high', 84, 'Allocation may not match a high-risk profile', `a high-risk profile paired with ${formatPercent(cashAndBondsWeight)} in cash and bonds may be more conservative than intended.`, 'If your goal is aggressive long-term growth, consider redeploying part of the conservative sleeve into diversified equities.'));
  pushRule(rules, horizon === 'less than 3 years' && equitiesWeight > 0.85, createRule('risk-mismatch', 'high', 90, 'Short horizon with very high equity exposure', `with a horizon under 3 years, keeping ${formatPercent(equitiesWeight)} in equities can create too much volatility before the money is needed.`, 'Move at least part of the portfolio into lower-volatility assets for the near-term goal.'));
  pushRule(rules, horizon === 'less than 3 years' && equitiesWeight > 0.7 && equitiesWeight <= 0.85, createRule('risk-mismatch', 'medium', 75, 'Short horizon still looks equity-heavy', `a portfolio with ${formatPercent(equitiesWeight)} in equities may be too volatile for money needed within 3 years.`, 'Bring more of the near-term money into bonds or cash-like assets.'));
  pushRule(rules, horizon === '7+ years' && equitiesWeight < 0.4, createRule('deployment', 'high', 82, 'Long horizon looks unusually conservative', `with a 7+ year horizon, only ${formatPercent(equitiesWeight)} in equities may leave growth potential on the table.`, 'If the money is truly long-term, consider increasing diversified equity exposure gradually over time.'));
  pushRule(rules, horizon === '7+ years' && equitiesWeight < 0.5 && equitiesWeight >= 0.4, createRule('deployment', 'medium', 71, 'Long horizon may support more growth exposure', `at ${formatPercent(equitiesWeight)} in equities, the portfolio is on the conservative side for a 7+ year horizon.`, 'You could direct some new contributions toward diversified equities if long-term growth is the goal.'));
  pushRule(rules, goal === 'save for big purchase' && equitiesWeight > 0.65, createRule('risk-mismatch', 'medium/high', 83, 'Big purchase goal may need a steadier mix', `because the goal is a big purchase, having ${formatPercent(equitiesWeight)} in equities may expose the money to too much short-term market risk.`, 'Match the portfolio to the purchase timeline by moving more of that goal money into lower-volatility assets.'));
  pushRule(rules, age < 35 && horizon === '7+ years' && equitiesWeight < 0.6, createRule('deployment', 'medium', 72, 'Long horizon may support more growth exposure', `at age ${age} with a 7+ year horizon, only ${formatPercent(equitiesWeight)} in equities may be more conservative than necessary.`, 'If you are comfortable with market swings, you may want a somewhat higher allocation to diversified equities over time.'));
  pushRule(rules, age < 30 && goal === 'grow your wealth long term' && risk === 'high' && cashAndBondsWeight > 0.4, createRule('deployment', 'medium', 76, 'Aggressive profile still holds a lot in cash or bonds', `for a younger investor seeking long-term growth with high risk tolerance, ${formatPercent(cashAndBondsWeight)} in cash and bonds may slow the portfolio down.`, 'If that conservative allocation is not intentional, shift part of it into diversified equities gradually.'));
  pushRule(rules, risk === 'high' && horizon === '7+ years' && cashWeight > 0.15, createRule('deployment', 'medium/high', 78, 'Cash level is high for a long-term aggressive profile', `a high-risk investor with a 7+ year horizon currently has ${formatPercent(cashWeight)} in cash.`, 'If the cash is not reserved for a near-term use, consider phasing it into the target portfolio over time.'));
  pushRule(rules, risk === 'medium' && horizon === '7+ years' && cashWeight > 0.2, createRule('deployment', 'medium', 69, 'Cash level is moderately high for a long-term balanced profile', `a medium-risk investor with a 7+ year horizon currently has ${formatPercent(cashWeight)} in cash.`, 'If that cash is meant for long-term investing, a gradual deployment plan could help it start working harder.'));
  pushRule(rules, cashWeight > 0.1 && monthlyContribution <= 0, createRule('deployment', 'medium', 74, 'You are not actively building the portfolio', `you currently hold ${formatPercent(cashWeight)} in cash and have no monthly contribution entered.`, 'Set up even a modest recurring contribution or create a schedule for putting idle cash to work.'));
  pushRule(rules, monthlyContribution <= 0 && currentCashAvailable > 0 && (horizon === '7+ years' || goal === 'retirement' || goal === 'grow your wealth long term'), createRule('deployment', 'medium', 68, 'No ongoing monthly contribution is set', 'you have investable cash today, but no monthly contribution entered. For long-term goals, regular contributions usually matter a lot.', 'Add a recurring monthly amount, even if small, so the portfolio continues to grow beyond the money already available today.'));
  pushRule(rules, fallbackCount > 0, createRule('coverage', 'useful', 52, 'Some holdings used fallback classification', `${fallbackCount} holding${fallbackCount > 1 ? 's were' : ' was'} not found in the local metadata library, so sector and geography were estimated instead of matched exactly.`, 'Review those tickers carefully, because adding more precise security data would improve the confidence of the analysis.'));

  return rules.sort((a, b) => b.priorityScore - a.priorityScore);
}

function analyzePortfolio(holdings, questionnaire) {
  const enrichedHoldings = holdings.map((holding) => {
    const metadata = resolveSecurity(holding.symbol, questionnaire);
    return {
      ...holding,
      metadata,
      isSingleStock: metadata.type === 'stock',
      primarySector: primaryBucket(normalizeTotals(metadata.sector, 1)),
      primaryGeography: primaryBucket(normalizeTotals(metadata.geography, 1)),
    };
  });

  const totalValue = enrichedHoldings.reduce((sum, holding) => sum + holding.amount, 0);
  const weightedHoldings = enrichedHoldings
    .map((holding) => ({ ...holding, weight: totalValue ? holding.amount / totalValue : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const assetClassTotals = {};
  const geographyTotals = {};
  const sectorTotals = {};
  const categoryTotals = {};
  const strategyExposure = {};
  const matchStats = { exact: 0, normalized: 0, fallback: 0 };

  weightedHoldings.forEach((holding) => {
    accumulateWeightedBreakdown(assetClassTotals, holding.metadata.assetClass, holding.amount);
    accumulateWeightedBreakdown(geographyTotals, holding.metadata.geography, holding.amount);
    accumulateWeightedBreakdown(sectorTotals, holding.metadata.sector, holding.amount);
    categoryTotals[holding.metadata.category] = (categoryTotals[holding.metadata.category] || 0) + holding.amount;
    strategyExposure[holding.metadata.strategyGroup] = (strategyExposure[holding.metadata.strategyGroup] || 0) + holding.amount;
    matchStats[holding.metadata.matchLevel] += 1;
  });

  const concentrationScore = weightedHoldings.slice(0, 3).reduce((sum, holding) => sum + holding.weight, 0);
  const summary = {
    totalValue,
    holdings: weightedHoldings,
    assetClassTotals: normalizeTotals(assetClassTotals, totalValue),
    geographyTotals: normalizeTotals(geographyTotals, totalValue),
    sectorTotals: normalizeTotals(sectorTotals, totalValue),
    categoryTotals: normalizeTotals(categoryTotals, totalValue),
    strategyExposure: normalizeTotals(strategyExposure, totalValue),
    matchStats,
    concentration: {
      largestHoldingWeight: weightedHoldings[0]?.weight || 0,
      topThreeWeight: concentrationScore,
    },
  };

  const rules = generateRules(summary, questionnaire);
  const groupedThemes = groupRules(rules);
  const positives = generatePositiveSignals(summary, questionnaire);
  const archetype = classifyArchetype(summary, groupedThemes, questionnaire, rules);
  const narrative = buildNarrative(summary, questionnaire, groupedThemes, positives, archetype);
  const health = computePortfolioHealth(groupedThemes, positives);

  return {
    ...summary,
    rules,
    groupedThemes,
    positives,
    archetype,
    narrative,
    health,
  };
}

function savePortfolio(analysis) {
  state.portfolio = analysis;
  try {
    window.localStorage.setItem('investAdvicePortfolio', JSON.stringify(analysis));
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }
}

function renderBreakdownList(items) {
  return `
    <ul class="metric-list">
      ${items
        .map(
          (item) => `
            <li>
              <span>${toTitleLabel(item.name)}</span>
              <span>${formatCurrency(item.value)} • ${formatPercent(item.weight)}</span>
            </li>
          `
        )
        .join('')}
    </ul>
  `;
}

function renderBarChart(items, chartClass) {
  return `
    <div class="chart-list">
      ${items
        .slice(0, 6)
        .map(
          (item) => `
            <div class="chart-row">
              <div class="chart-labels">
                <span>${toTitleLabel(item.name)}</span>
                <span>${formatPercent(item.weight)}</span>
              </div>
              <div class="chart-track">
                <div class="chart-fill ${chartClass}" style="width: ${Math.max(item.weight * 100, 2)}%"></div>
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderPieChart(items, title) {
  const topItems = items.slice(0, 5);
  const remainder = Math.max(0, 1 - topItems.reduce((sum, item) => sum + item.weight, 0));
  const slices = remainder > 0.01 ? [...topItems, { name: 'Other', weight: remainder }] : topItems;
  let offset = 0;
  const gradient = slices
    .map((item, index) => {
      const start = offset * 100;
      offset += item.weight;
      const end = offset * 100;
      return `${PALETTE[index % PALETTE.length]} ${start}% ${end}%`;
    })
    .join(', ');

  return `
    <section class="sub-card pie-card">
      <h4>${title}</h4>
      <div class="pie-layout">
        <div class="pie-chart" style="background: conic-gradient(${gradient || '#334155 0 100%'});"></div>
        <ul class="legend-list">
          ${slices
            .map(
              (item, index) => `
                <li>
                  <span class="legend-swatch" style="background:${PALETTE[index % PALETTE.length]}"></span>
                  <span>${toTitleLabel(item.name)}</span>
                  <strong>${formatPercent(item.weight)}</strong>
                </li>
              `
            )
            .join('')}
        </ul>
      </div>
    </section>
  `;
}

function renderThemes(groupedThemes) {
  if (!groupedThemes.length) {
    return `
      <section class="sub-card">
        <h4>Portfolio themes</h4>
        <p>No major risk theme stood out from the current portfolio snapshot.</p>
      </section>
    `;
  }

  return `
    <section class="sub-card">
      <h4>Portfolio themes</h4>
      <div class="theme-grid">
        ${groupedThemes
          .slice(0, 4)
          .map(
            (theme) => `
              <article class="theme-card">
                <p class="theme-label">${toTitleLabel(theme.theme)}</p>
                <strong>Priority ${theme.priorityScore}</strong>
                <p>${theme.rules[0].title}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderNarrative(analysis) {
  const secondaryArchetype = analysis.narrative.secondaryArchetype;
  return `
    <section class="sub-card narrative-card">
      <div class="narrative-header">
        <div>
          <p class="eyebrow small">Portfolio archetype</p>
          <h4>${analysis.narrative.primaryArchetype.label}</h4>
          ${secondaryArchetype ? `<p class="secondary-archetype"><strong>Secondary archetype:</strong> ${secondaryArchetype.label}</p>` : ''}
          <p class="status-copy">${analysis.narrative.profileFit}</p>
        </div>
        <div class="match-pill-group">
          <span class="match-pill">Exact: ${analysis.matchStats.exact}</span>
          <span class="match-pill">Normalized: ${analysis.matchStats.normalized}</span>
          <span class="match-pill">Fallback: ${analysis.matchStats.fallback}</span>
        </div>
      </div>
      <div class="narrative-grid">
        <article>
          <h5>Section 1: Portfolio diagnosis</h5>
          <p>${analysis.narrative.diagnosis}</p>
        </article>
        <article>
          <h5>Section 2: Main issue</h5>
          <p>${analysis.narrative.mainIssue}</p>
        </article>
        <article>
          <h5>Section 3: Secondary issues</h5>
          <ul class="metric-list compact-list">
            ${analysis.narrative.secondaryIssues.map((issue) => `<li><span>${issue}</span></li>`).join('')}
          </ul>
        </article>
        <article>
          <h5>Section 4: What’s working</h5>
          <ul class="metric-list compact-list">
            ${analysis.narrative.whatWorking.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </article>
        <article class="full-width">
          <h5>Section 5: What to do next</h5>
          <ol class="action-list">
            ${analysis.narrative.actionSteps.map((step) => `<li>${step}</li>`).join('')}
          </ol>
        </article>
      </div>
    </section>
  `;
}

function renderRules(rules) {
  if (!rules.length) {
    return `
      <div class="sub-card">
        <h4>Top triggered rules</h4>
        <p>No major rule-based issues were triggered. The portfolio appears reasonably aligned with the questionnaire inputs.</p>
      </div>
    `;
  }

  return `
    <div class="sub-card">
      <h4>Top triggered rules</h4>
      <div class="rule-list">
        ${rules
          .slice(0, 5)
          .map(
            (rule) => `
              <article class="rule-card">
                <div class="rule-meta">
                  <span class="severity ${SEVERITY_STYLES[rule.severity] || 'severity-medium'}">${rule.severity}</span>
                  <span>${toTitleLabel(rule.theme)} • Priority ${rule.priorityScore}</span>
                </div>
                <h5>${rule.title}</h5>
                <p>${rule.detail}</p>
                <div class="next-step">
                  <strong>How to fix it</strong>
                  <p>${rule.recommendation}</p>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderPositiveSignals(positives) {
  return `
    <section class="sub-card">
      <h4>What you are doing well</h4>
      <ul class="metric-list">
        ${(positives.length ? positives : ['You already have money invested, which is a useful starting point to build from.'])
          .map(
            (item) => `
              <li>
                <span>${item}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    </section>
  `;
}

function renderPortfolioAnalysis(analysis) {
  analysisOutput.classList.remove('hidden');
  analysisOutput.innerHTML = `
    <div class="analysis-stack">
      <div class="sub-card overview-grid">
        <div>
          <h4>Portfolio health</h4>
          <strong class="headline-metric">${analysis.health.score}/100</strong>
          <p class="status-copy">${analysis.health.label}</p>
        </div>
        <div>
          <h4>Total portfolio value</h4>
          <strong class="headline-metric">${formatCurrency(analysis.totalValue)}</strong>
        </div>
        <div>
          <h4>Largest holding</h4>
          <strong class="headline-metric">${analysis.holdings[0]?.symbol || 'N/A'} • ${formatPercent(analysis.holdings[0]?.weight || 0)}</strong>
        </div>
        <div>
          <h4>Top 3 concentration</h4>
          <strong class="headline-metric">${formatPercent(analysis.concentration.topThreeWeight)}</strong>
        </div>
      </div>

      ${renderNarrative(analysis)}
      ${renderThemes(analysis.groupedThemes)}
      ${renderRules(analysis.rules)}
      ${renderPositiveSignals(analysis.positives)}

      <div class="breakdown-grid pie-grid">
        ${renderPieChart(analysis.sectorTotals, 'Sector allocation pie chart')}
        ${renderPieChart(analysis.geographyTotals, 'Geography allocation pie chart')}
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Sector allocation chart</h4>
          ${renderBarChart(analysis.sectorTotals, 'chart-sector')}
        </section>
        <section class="sub-card">
          <h4>Geography allocation chart</h4>
          ${renderBarChart(analysis.geographyTotals, 'chart-geography')}
        </section>
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Asset class totals</h4>
          ${renderBreakdownList(analysis.assetClassTotals)}
        </section>
        <section class="sub-card">
          <h4>Category totals</h4>
          ${renderBreakdownList(analysis.categoryTotals)}
        </section>
        <section class="sub-card">
          <h4>Geography totals</h4>
          ${renderBreakdownList(analysis.geographyTotals)}
        </section>
        <section class="sub-card">
          <h4>Sector totals</h4>
          ${renderBreakdownList(analysis.sectorTotals)}
        </section>
      </div>

      <section class="sub-card">
        <h4>Per-holding weights</h4>
        <ul class="metric-list">
          ${analysis.holdings
            .map(
              (holding) => `
                <li>
                  <span>${holding.symbol} (${toTitleLabel(holding.metadata.category)} • ${toTitleLabel(holding.primarySector)} • ${holding.metadata.matchLevel})</span>
                  <span>${formatCurrency(holding.amount)} • ${formatPercent(holding.weight)}</span>
                </li>
              `
            )
            .join('')}
        </ul>
      </section>
    </div>
  `;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  state.login = {
    ...Object.fromEntries(formData.entries()),
    newsletterOptIn: formData.get('newsletterOptIn') === 'on',
  };
  showScreen('questionnaire-screen');
});

questionnaireForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(questionnaireForm);
  state.questionnaire = Object.fromEntries(formData.entries());
  starterOutput.innerHTML = renderStarterPlan(buildStarterPlanSummary(state.questionnaire));
  analysisOutput.classList.add('hidden');
  analysisOutput.innerHTML = '';
  await saveProfileToSupabase();
  showScreen('choice-screen');
});

document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = button.dataset.target;
    if (target === 'starter-screen' && state.questionnaire) {
      starterOutput.innerHTML = renderStarterPlan(buildStarterPlanSummary(state.questionnaire));
    }
    if (target === 'profile-screen') {
      await loadProfileFromSupabase();
    }
    showScreen(target);
  });
});

analysisForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(analysisForm);
  const holdings = parseHoldings(String(formData.get('holdings') || ''));
  const invalidEntries = holdings.filter((holding) => !holding.symbol || Number.isNaN(holding.amount) || holding.amount <= 0);

  if (!holdings.length || invalidEntries.length) {
    analysisOutput.classList.remove('hidden');
    analysisOutput.innerHTML = `
      <strong>Please check your format.</strong>
      <p>Use one holding per line in the format <em>TICKER — 5000</em>, and for cash, just write format of <em>CASH — 5000</em>.</p>
    `;
    return;
  }

  const analysis = analyzePortfolio(holdings, state.questionnaire);
  savePortfolio(analysis);
  renderPortfolioAnalysis(analysis);
});

window.parseHoldings = parseHoldings;
window.analyzePortfolio = analyzePortfolio;
window.resolveSecurity = resolveSecurity;
window.getSecurityMetadataTable = getSecurityMetadataTable;
  ['XLV', 'Health Care Select Sector SPDR Fund', 'healthcare-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Healthcare: 1 }],
  ['XLE', 'Energy Select Sector SPDR Fund', 'energy-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Energy: 1 }],
  ['XLI', 'Industrial Select Sector SPDR Fund', 'industrials-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Industrials: 1 }],
  ['XLP', 'Consumer Staples Select Sector SPDR Fund', 'consumer-staples-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { ConsumerStaples: 1 }],
  ['XLY', 'Consumer Discretionary Select Sector SPDR Fund', 'consumer-discretionary-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { ConsumerDiscretionary: 1 }],
  ['XLC', 'Communication Services Select Sector SPDR Fund', 'communication-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { CommunicationServices: 1 }],
  ['XLU', 'Utilities Select Sector SPDR Fund', 'utilities-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Utilities: 1 }],
  ['XLB', 'Materials Select Sector SPDR Fund', 'materials-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { Materials: 1 }],
  ['XLRE', 'Real Estate Select Sector SPDR Fund', 'real-estate-sector', ['sector-etf'], { equities: 1 }, { 'United States': 0.99, International: 0.01 }, { RealEstate: 1 }],
  ['VT', 'Vanguard Total World Stock ETF', 'global-total-market', ['all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.62, International: 0.38 }, { Technology: 0.24, Financials: 0.16, Industrials: 0.11, ConsumerDiscretionary: 0.1, Healthcare: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.07, Energy: 0.05, Materials: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VXUS', 'Vanguard Total International Stock ETF', 'international-total-market', ['international-core'], { equities: 1 }, { International: 0.98, 'United States': 0.02 }, { Financials: 0.2, Industrials: 0.14, Technology: 0.13, ConsumerDiscretionary: 0.12, Healthcare: 0.09, Materials: 0.09, ConsumerStaples: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VEA', 'Vanguard FTSE Developed Markets ETF', 'international-developed', ['international-core'], { equities: 1 }, { International: 0.97, 'United States': 0.03 }, { Financials: 0.2, Industrials: 0.16, Healthcare: 0.11, ConsumerDiscretionary: 0.11, Technology: 0.1, ConsumerStaples: 0.09, Materials: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['VWO', 'Vanguard FTSE Emerging Markets ETF', 'emerging-markets', ['international-core'], { equities: 1 }, { International: 0.99, 'United States': 0.01 }, { Technology: 0.24, Financials: 0.21, ConsumerDiscretionary: 0.14, CommunicationServices: 0.1, Industrials: 0.08, Materials: 0.07, ConsumerStaples: 0.06, Energy: 0.05, Healthcare: 0.04, Utilities: 0.01 }],
  ['BND', 'Vanguard Total Bond Market ETF', 'core-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 0.9, International: 0.1 }, { Bonds: 1 }],
  ['AGG', 'iShares Core U.S. Aggregate Bond ETF', 'core-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 0.9, International: 0.1 }, { Bonds: 1 }],
  ['BNDX', 'Vanguard Total International Bond ETF', 'international-bonds', ['bond-core'], { bonds: 1 }, { International: 0.98, 'United States': 0.02 }, { Bonds: 1 }],
  ['SCHD', 'Schwab U.S. Dividend Equity ETF', 'us-dividend-equity', ['dividend'], { equities: 1 }, { 'United States': 0.97, International: 0.03 }, { Financials: 0.19, Healthcare: 0.16, Technology: 0.14, Industrials: 0.13, ConsumerStaples: 0.11, Energy: 0.09, ConsumerDiscretionary: 0.07, CommunicationServices: 0.04, Utilities: 0.03, Materials: 0.02, RealEstate: 0.02 }],
  ['DGRO', 'iShares Core Dividend Growth ETF', 'dividend-growth', ['dividend'], { equities: 1 }, { 'United States': 0.96, International: 0.04 }, { Technology: 0.2, Financials: 0.17, Healthcare: 0.15, Industrials: 0.12, ConsumerStaples: 0.09, ConsumerDiscretionary: 0.09, Energy: 0.07, CommunicationServices: 0.05, Utilities: 0.03, Materials: 0.02, RealEstate: 0.01 }],
  ['VYM', 'Vanguard High Dividend Yield ETF', 'dividend-income', ['dividend'], { equities: 1 }, { 'United States': 0.95, International: 0.05 }, { Financials: 0.19, Healthcare: 0.14, ConsumerStaples: 0.13, Industrials: 0.13, Technology: 0.12, Energy: 0.08, Utilities: 0.06, ConsumerDiscretionary: 0.06, CommunicationServices: 0.05, Materials: 0.02, RealEstate: 0.02 }],
  ['VNQ', 'Vanguard Real Estate ETF', 'reit', ['real-estate'], { realEstate: 1 }, { 'United States': 0.97, International: 0.03 }, { RealEstate: 1 }],
  ['GLD', 'SPDR Gold Shares', 'gold', ['commodity'], { alternatives: 1 }, { International: 0.6, 'United States': 0.4 }, { Commodities: 1 }],
  ['IAU', 'iShares Gold Trust', 'gold', ['commodity'], { alternatives: 1 }, { International: 0.6, 'United States': 0.4 }, { Commodities: 1 }],
  ['TIP', 'iShares TIPS Bond ETF', 'inflation-protected-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 1 }, { Bonds: 1 }],
  ['BIL', 'SPDR Bloomberg 1-3 Month T-Bill ETF', 'ultra-short-treasury', ['bond-core', 'cash-equivalent'], { cash: 0.75, bonds: 0.25 }, { 'United States': 1 }, { Bonds: 1 }],
  ['SGOV', 'iShares 0-3 Month Treasury Bond ETF', 'ultra-short-treasury', ['bond-core', 'cash-equivalent'], { cash: 0.75, bonds: 0.25 }, { 'United States': 1 }, { Bonds: 1 }],
  ['SHY', 'iShares 1-3 Year Treasury Bond ETF', 'short-duration-bonds', ['bond-core'], { bonds: 1 }, { 'United States': 1 }, { Bonds: 1 }],
  ['ACWI', 'iShares MSCI ACWI ETF', 'global-total-market', ['all-equity-broad-market', 'core'], { equities: 1 }, { 'United States': 0.62, International: 0.38 }, { Technology: 0.24, Financials: 0.16, Industrials: 0.11, ConsumerDiscretionary: 0.1, Healthcare: 0.1, CommunicationServices: 0.08, ConsumerStaples: 0.07, Energy: 0.05, Materials: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['EFA', 'iShares MSCI EAFE ETF', 'international-developed', ['international-core'], { equities: 1 }, { International: 0.97, 'United States': 0.03 }, { Financials: 0.2, Industrials: 0.16, Healthcare: 0.11, ConsumerDiscretionary: 0.11, Technology: 0.1, ConsumerStaples: 0.09, Materials: 0.08, Energy: 0.06, CommunicationServices: 0.04, Utilities: 0.03, RealEstate: 0.02 }],
  ['EEM', 'iShares MSCI Emerging Markets ETF', 'emerging-markets', ['international-core'], { equities: 1 }, { International: 0.99, 'United States': 0.01 }, { Technology: 0.24, Financials: 0.21, ConsumerDiscretionary: 0.14, CommunicationServices: 0.1, Industrials: 0.08, Materials: 0.07, ConsumerStaples: 0.06, Energy: 0.05, Healthcare: 0.04, Utilities: 0.01 }],
  ['IWF', 'iShares Russell 1000 Growth ETF', 'us-growth-style', ['growth-etf', 'thematic-etf'], { equities: 1 }, { 'United States': 0.98, International: 0.02 }, { Technology: 0.44, CommunicationServices: 0.14, ConsumerDiscretionary: 0.14, Healthcare: 0.09, Industrials: 0.06, Financials: 0.05, ConsumerStaples: 0.03, Energy: 0.02, Utilities: 0.01, Materials: 0.01, RealEstate: 0.01 }],
  ['SOXX', 'iShares Semiconductor ETF', 'semiconductor-theme', ['sector-etf', 'thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.85, International: 0.15 }, { Technology: 1 }],
  ['SMH', 'VanEck Semiconductor ETF', 'semiconductor-theme', ['sector-etf', 'thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.83, International: 0.17 }, { Technology: 1 }],
  ['ARKK', 'ARK Innovation ETF', 'innovation-theme', ['thematic-etf', 'growth-etf'], { equities: 1 }, { 'United States': 0.9, International: 0.1 }, { Technology: 0.42, Healthcare: 0.22, CommunicationServices: 0.12, ConsumerDiscretionary: 0.12, Industrials: 0.07, Financials: 0.05 }],
  ['IBIT', 'iShares Bitcoin Trust ETF', 'bitcoin-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['FBTC', 'Fidelity Wise Origin Bitcoin Fund', 'bitcoin-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['ETHA', 'iShares Ethereum Trust ETF', 'ethereum-theme', ['thematic-etf', 'crypto-etf'], { alternatives: 1 }, { International: 1 }, { Crypto: 1 }],
  ['CASH', 'Cash', 'cash', ['cash-equivalent'], { cash: 1 }, { 'United States': 1 }, { Cash: 1 }, ['USD', 'MONEY MARKET', 'CASH RESERVE']],
];

const STOCK_LIBRARY = [
  ['AAPL', 'Apple', 'Technology', 'United States', ['APPLE INC']],
  ['MSFT', 'Microsoft', 'Technology', 'United States'],
  ['NVDA', 'NVIDIA', 'Technology', 'United States'],
  ['GOOGL', 'Alphabet Class A', 'CommunicationServices', 'United States', ['GOOG', 'ALPHABET']],
  ['AMZN', 'Amazon', 'ConsumerDiscretionary', 'United States'],
  ['META', 'Meta Platforms', 'CommunicationServices', 'United States', ['FACEBOOK']],
  ['TSLA', 'Tesla', 'ConsumerDiscretionary', 'United States'],
  ['BRK.B', 'Berkshire Hathaway Class B', 'Financials', 'United States', ['BRKB', 'BRK-B', 'BERKSHIRE']],
  ['JPM', 'JPMorgan Chase', 'Financials', 'United States'],
  ['BAC', 'Bank of America', 'Financials', 'United States'],
  ['WFC', 'Wells Fargo', 'Financials', 'United States'],
  ['V', 'Visa', 'Financials', 'United States'],
  ['MA', 'Mastercard', 'Financials', 'United States'],
  ['GS', 'Goldman Sachs', 'Financials', 'United States'],
  ['JNJ', 'Johnson & Johnson', 'Healthcare', 'United States'],
  ['UNH', 'UnitedHealth Group', 'Healthcare', 'United States'],
  ['PFE', 'Pfizer', 'Healthcare', 'United States'],
  ['LLY', 'Eli Lilly', 'Healthcare', 'United States'],
  ['MRK', 'Merck', 'Healthcare', 'United States'],
  ['ABBV', 'AbbVie', 'Healthcare', 'United States'],
  ['XOM', 'Exxon Mobil', 'Energy', 'United States'],
  ['CVX', 'Chevron', 'Energy', 'United States'],
  ['COP', 'ConocoPhillips', 'Energy', 'United States'],
  ['SLB', 'Schlumberger', 'Energy', 'United States'],
  ['KO', 'Coca-Cola', 'ConsumerStaples', 'United States'],
  ['PEP', 'PepsiCo', 'ConsumerStaples', 'United States'],
  ['PG', 'Procter & Gamble', 'ConsumerStaples', 'United States'],
  ['WMT', 'Walmart', 'ConsumerStaples', 'United States'],
  ['COST', 'Costco', 'ConsumerStaples', 'United States'],
  ['HD', 'Home Depot', 'ConsumerDiscretionary', 'United States'],
  ['MCD', 'McDonald\'s', 'ConsumerDiscretionary', 'United States'],
  ['NKE', 'Nike', 'ConsumerDiscretionary', 'United States'],
  ['SBUX', 'Starbucks', 'ConsumerDiscretionary', 'United States'],
  ['DIS', 'Walt Disney', 'CommunicationServices', 'United States'],
  ['NFLX', 'Netflix', 'CommunicationServices', 'United States'],
  ['T', 'AT&T', 'CommunicationServices', 'United States'],
  ['VZ', 'Verizon', 'CommunicationServices', 'United States'],
  ['CSCO', 'Cisco', 'Technology', 'United States'],
  ['ORCL', 'Oracle', 'Technology', 'United States'],
  ['CRM', 'Salesforce', 'Technology', 'United States'],
  ['ADBE', 'Adobe', 'Technology', 'United States'],
  ['INTC', 'Intel', 'Technology', 'United States'],
  ['AMD', 'Advanced Micro Devices', 'Technology', 'United States'],
  ['QCOM', 'Qualcomm', 'Technology', 'United States'],
  ['AVGO', 'Broadcom', 'Technology', 'United States'],
  ['IBM', 'IBM', 'Technology', 'United States'],
  ['TXN', 'Texas Instruments', 'Technology', 'United States'],
  ['CAT', 'Caterpillar', 'Industrials', 'United States'],
  ['GE', 'GE Aerospace', 'Industrials', 'United States'],
  ['HON', 'Honeywell', 'Industrials', 'United States'],
  ['UPS', 'United Parcel Service', 'Industrials', 'United States'],
  ['UNP', 'Union Pacific', 'Industrials', 'United States'],
  ['LMT', 'Lockheed Martin', 'Industrials', 'United States'],
  ['BA', 'Boeing', 'Industrials', 'United States'],
  ['DE', 'Deere', 'Industrials', 'United States'],
  ['NEE', 'NextEra Energy', 'Utilities', 'United States'],
  ['DUK', 'Duke Energy', 'Utilities', 'United States'],
  ['SO', 'Southern Company', 'Utilities', 'United States'],
  ['PLD', 'Prologis', 'RealEstate', 'United States'],
  ['AMT', 'American Tower', 'RealEstate', 'United States'],
  ['O', 'Realty Income', 'RealEstate', 'United States'],
  ['SPG', 'Simon Property Group', 'RealEstate', 'United States'],
  ['LIN', 'Linde', 'Materials', 'United States'],
  ['APD', 'Air Products and Chemicals', 'Materials', 'United States'],
  ['NEM', 'Newmont', 'Materials', 'United States'],
  ['RIO', 'Rio Tinto', 'Materials', 'International'],
  ['BABA', 'Alibaba', 'ConsumerDiscretionary', 'International'],
  ['TSM', 'Taiwan Semiconductor', 'Technology', 'International'],
  ['ASML', 'ASML Holding', 'Technology', 'International'],
  ['SAP', 'SAP', 'Technology', 'International'],
  ['SONY', 'Sony Group', 'ConsumerDiscretionary', 'International'],
  ['TM', 'Toyota Motor', 'ConsumerDiscretionary', 'International'],
  ['NVO', 'Novo Nordisk', 'Healthcare', 'International'],
  ['UL', 'Unilever', 'ConsumerStaples', 'International'],
  ['BP', 'BP', 'Energy', 'International'],
  ['SHEL', 'Shell', 'Energy', 'International'],
  ['SHOP', 'Shopify', 'Technology', 'International'],
  ['SQ', 'Block', 'Financials', 'United States', ['BLOCK']],
  ['PYPL', 'PayPal', 'Financials', 'United States'],
  ['ROKU', 'Roku', 'CommunicationServices', 'United States'],
  ['UBER', 'Uber', 'Industrials', 'United States'],
  ['SNOW', 'Snowflake', 'Technology', 'United States'],
  ['PANW', 'Palo Alto Networks', 'Technology', 'United States'],
  ['CRWD', 'CrowdStrike', 'Technology', 'United States'],
  ['MELI', 'MercadoLibre', 'ConsumerDiscretionary', 'International'],
  ['SE', 'Sea Limited', 'CommunicationServices', 'International'],
];

const CRYPTO_LIBRARY = [
  ['BTC', 'Bitcoin', 'Crypto', 'International', ['BITCOIN', 'XBT']],
  ['ETH', 'Ethereum', 'Crypto', 'International', ['ETHER']],
  ['SOL', 'Solana', 'Crypto', 'International'],
  ['BNB', 'BNB', 'Crypto', 'International'],
  ['XRP', 'XRP', 'Crypto', 'International'],
  ['DOGE', 'Dogecoin', 'Crypto', 'International'],
  ['USDC', 'USD Coin', 'Cash', 'International', ['USD COIN']],
  ['USDT', 'Tether USD', 'Cash', 'International', ['TETHER']],
];

function toTitleLabel(value) {
  return String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\bEtf\b/g, 'ETF')
    .replace(/\bUs\b/g, 'U.S.')
    .trim();
}

function normalizeLookupKey(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[.\-_/]/g, '');
}

function deriveEtfCategory(strategyGroup, tags = []) {
  if (tags.includes('cash-equivalent')) return 'cash equivalent';
  if (tags.includes('bond-core') || strategyGroup.includes('bond')) return 'aggregate bonds';
  if (tags.includes('dividend')) return 'dividend';
  if (tags.includes('sector-etf')) return 'sector ETF';
  if (tags.includes('growth-etf')) return 'tech/growth';
  if (strategyGroup.includes('us-large-cap') || strategyGroup.includes('us-total-market')) return 'US large cap';
  if (strategyGroup.includes('global')) return 'global equity';
  if (strategyGroup.includes('international-developed')) return 'international developed';
  if (strategyGroup.includes('emerging')) return 'emerging markets';
  if (tags.includes('international-core')) return 'international equity';
  if (tags.includes('crypto-etf')) return 'crypto thematic';
  return 'broad ETF';
}

function buildMetadataIndexes() {
  const exact = {};
  const normalized = {};
  const table = [];

  ETF_LIBRARY.forEach(([symbol, name, strategyGroup, tags, assetClass, geography, sector, aliases = []]) => {
    const assetType = symbol === 'CASH' ? 'cash' : tags.includes('bond-core') ? 'bond fund' : 'ETF';
    const domicile = Object.entries(geography || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
    const entry = {
      symbol,
      name,
      type: symbol === 'CASH' ? 'cash' : 'etf',
      assetType,
      category: tags.includes('sector-etf') ? 'sector ETF' : tags.includes('bond-core') ? 'bond ETF' : tags.includes('cash-equivalent') ? 'cash' : 'ETF',
      etfCategory: deriveEtfCategory(strategyGroup, tags),
      strategyGroup,
      tags,
      assetClass,
      geography,
      domicile,
      sector,
      aliases,
      indexedExposure: tags.includes('broad-us-etf') || tags.includes('all-equity-broad-market'),
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType,
      sector: Object.keys(sector || {})[0] || 'Unknown',
      geography: domicile,
      etfKind: tags.includes('sector-etf') ? 'sector ETF' : tags.includes('thematic-etf') ? 'thematic ETF' : tags.includes('bond-core') ? 'bond ETF' : tags.includes('cash-equivalent') ? 'cash equivalent' : 'broad ETF',
      etfCategory: deriveEtfCategory(strategyGroup, tags),
      matchCoverage: 'exact + normalized',
    });
  });

  STOCK_LIBRARY.forEach(([symbol, name, sector, geography, aliases = []]) => {
    const entry = {
      symbol,
      name,
      type: 'stock',
      assetType: 'stock',
      category: 'single stock',
      strategyGroup: `single-stock-${normalizeLookupKey(symbol)}`,
      tags: ['single-stock'],
      assetClass: { equities: 1 },
      geography: { [geography]: 1 },
      domicile: geography,
      sector: { [sector]: 1 },
      aliases,
      indexedExposure: geography === 'United States',
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType: 'stock',
      sector,
      geography,
      etfKind: 'n/a',
      etfCategory: 'n/a',
      matchCoverage: 'exact + normalized',
    });
  });

  CRYPTO_LIBRARY.forEach(([symbol, name, sector, geography, aliases = []]) => {
    const entry = {
      symbol,
      name,
      type: 'crypto',
      assetType: 'crypto',
      category: 'crypto asset',
      strategyGroup: `crypto-${normalizeLookupKey(symbol)}`,
      tags: ['crypto-asset'],
      assetClass: { alternatives: 1 },
      geography: { [geography]: 1 },
      domicile: geography,
      sector: { [sector]: 1 },
      aliases,
      indexedExposure: false,
    };

    exact[symbol] = entry;
    [symbol, name, ...aliases].forEach((alias) => {
      normalized[normalizeLookupKey(alias)] = entry;
    });

    table.push({
      ticker: symbol,
      name,
      assetType: 'crypto',
      sector,
      geography,
      etfKind: 'n/a',
      etfCategory: 'n/a',
      matchCoverage: 'exact + normalized',
    });
  });

  return { exact, normalized, table: table.sort((a, b) => a.ticker.localeCompare(b.ticker)) };
}

const SECURITY_INDEXES = buildMetadataIndexes();

function getSecurityMetadataTable() {
  return SECURITY_INDEXES.table;
}

const state = {
  login: null,
  questionnaire: null,
  portfolio: null,
};

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function classifyStarterBucket(answers) {
  const age = Number(answers.age || 0);
  const horizon = answers.timeHorizon;
  const risk = answers.riskTolerance;
  const goal = answers.mainGoal;

  if (horizon === 'less than 3 years' || goal === 'save for big purchase') {
    return {
      key: 'short-term-investor',
      label: 'Short-term investor',
      style: 'Capital preservation portfolio',
      styleMessage: 'Your priority is protecting money you may need soon, so growth matters less than stability.',
      allocation: ['Low equity', 'High cash and/or bonds'],
      allocationMessage: 'Most of your portfolio should stay in safer assets because you may need the money soon.',
      investIn: ['High-interest cash', 'Short-term bond exposure', 'Lower-volatility holdings'],
      avoid: ['Aggressive stocks', 'Concentrated positions'],
    };
  }

  if (risk === 'high' && horizon === '7+ years' && goal === 'grow your wealth long term' && age <= 35) {
    return {
      key: 'aggressive-long-term-investor',
      label: 'Aggressive long-term investor',
      style: 'Simple long-term growth portfolio',
      styleMessage: 'Your profile supports a mostly equity-based strategy built for long-term compounding.',
      allocation: ['Very high or full equity exposure', 'Very little cash unless intentionally held'],
      allocationMessage: 'Your profile supports prioritizing long-term growth over short-term stability.',
      investIn: ['Broad all-equity ETF', 'A simple combination of U.S. + international equity ETFs'],
      avoid: ['Large idle cash balances unless intentional', 'Needlessly complex holdings'],
    };
  }

  if (risk === 'high' && horizon === '7+ years') {
    return {
      key: 'growth-investor',
      label: 'Growth investor',
      style: 'Growth-focused ETF portfolio',
      styleMessage: 'Because you have time and can tolerate volatility, a stock-heavy portfolio likely makes sense.',
      allocation: ['High equities', 'Little bonds/cash'],
      allocationMessage: 'Because your time horizon is long, equities can play the main role in your portfolio.',
      investIn: ['Broad equity ETFs', 'Strong international diversification', 'Little or no bond allocation depending on profile'],
      avoid: ['Too much idle cash', 'Overly conservative allocations for long-term money'],
    };
  }

  if (risk === 'medium' && (horizon === '3-7 years' || horizon === '7+ years')) {
    return {
      key: 'balanced-investor',
      label: 'Balanced investor',
      style: 'Balanced ETF portfolio',
      styleMessage: 'A diversified portfolio with both growth and stability may fit you best.',
      allocation: ['Meaningful equities', 'Moderate bonds/cash'],
      allocationMessage: 'This is a middle-ground portfolio that aims for growth without being too aggressive.',
      investIn: ['Broad U.S. equity ETF', 'International equity ETF', 'Bond ETF'],
      avoid: ['Overconcentration in one asset', 'Overcomplicating the portfolio'],
    };
  }

  if (risk === 'low') {
    return {
      key: 'conservative-investor',
      label: 'Conservative investor',
      style: 'Conservative diversified portfolio',
      styleMessage: 'You likely need some growth, but with a more stable mix that matches your comfort level.',
      allocation: ['Moderate equities', 'Meaningful bonds/cash'],
      allocationMessage: 'This gives you some growth while limiting large swings.',
      investIn: ['Broad stock ETFs', 'Bond ETFs', 'Simple diversified funds'],
      avoid: ['Very aggressive allocations', 'Concentrated single-stock positions'],
    };
  }

  return {
    key: 'balanced-investor',
    label: 'Balanced investor',
    style: 'Balanced ETF portfolio',
    styleMessage: 'A diversified portfolio with both growth and stability may fit you best.',
    allocation: ['Meaningful equities', 'Moderate bonds/cash'],
    allocationMessage: 'This is a middle-ground portfolio that aims for growth without being too aggressive.',
    investIn: ['Broad U.S. equity ETF', 'International equity ETF', 'Bond ETF'],
    avoid: ['Overconcentration in one asset', 'Overcomplicating the portfolio'],
  };
}

const STARTER_OPTION_LIBRARY = {
  'short-term-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'Focus on preserving capital rather than growth.',
      allocationLines: [
        'High-interest savings / cash equivalents.',
        'Short-term bond ETF (e.g., ZAG or BND).',
      ],
      examples: 'Examples: ZAG, BND.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use mostly safer assets with only optional equity exposure.',
      allocationLines: [
        '60–80% cash / short-term bonds.',
        '20–40% broad, stable equity ETF (optional depending on timeline).',
      ],
      examples: 'Examples: Bond ETF: ZAG, BND. Equity ETF (small portion): VTI.',
    },
  ],
  'conservative-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'Balanced ETF with built-in diversification.',
      allocationLines: ['Use a one-ticket balanced ETF to keep the portfolio stable and simple.'],
      examples: 'Examples: VBAL, XBAL.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Blend equities and bonds with a conservative tilt.',
      allocationLines: [
        '40–60% equities.',
        '40–60% bonds.',
        'Keep any stock picks very small.',
      ],
      examples: 'Examples: Equity ETFs: VFV, XEF. Bond ETFs: ZAG. Optional very small stock sleeve: JNJ, PG, IAU.',
    },
  ],
  'balanced-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'One all-in-one ETF.',
      allocationLines: ['Choose a diversified growth-and-bond mix in one fund.'],
      examples: 'Examples: VGRO, XGRO.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use a balanced split across equities and bonds.',
      allocationLines: [
        '60–80% equities.',
        '20–40% bonds.',
        'Keep stock tilts small and intentional.',
      ],
      examples: 'Examples: US equity: VTI or VFV. International: XEF. Bonds: ZAG. Small stock sleeve: GOOGL, MSFT, PG, IAU.',
    },
  ],
  'growth-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: 'All-equity ETF.',
      allocationLines: ['Keep the core simple with one global all-equity fund.'],
      examples: 'Examples: XEQT, VEQT.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Use a high-equity allocation with regional diversification.',
      allocationLines: [
        '80–100% equities.',
        'Diversify across U.S., international, and emerging markets.',
      ],
      examples: 'Examples: US equity: VTI or VOO. International: XEF. Emerging markets: XEC. Stock ideas: GOOGL, MSFT, NVDA, ASML, IAU.',
    },
  ],
  'aggressive-long-term-investor': [
    {
      title: 'Option 1: Simplest option',
      focus: '100% global equity ETF.',
      allocationLines: ['Use one broad all-equity ETF as the long-term compounding core.'],
      examples: 'Examples: XEQT, VEQT.',
    },
    {
      title: 'Option 2: More customizable option',
      focus: 'Very high equity with optional growth/conviction tilts.',
      allocationLines: [
        '90–100% equities.',
        'Heavier tilt toward growth / conviction ideas.',
      ],
      examples: 'Examples: Core ETFs: VTI, XEF. Growth ETF tilt: QQQ. Stock/alt ideas: GOOGL, ASML, NVDA, TSLA, BTC.',
    },
  ],
};

function buildStarterPlanSummary(answers) {
  const cash = Number(answers.currentCash || 0);
  const monthly = Number(answers.monthlyAmount || 0);
  const bucket = classifyStarterBucket(answers);
  const summary = `At age ${answers.age} in ${answers.country}, you are investing for ${answers.mainGoal} over a ${answers.timeHorizon} horizon with a ${answers.riskTolerance} risk profile. Because time horizon and risk tolerance matter most, your profile fits the ${bucket.label.toLowerCase()} bucket best.`;

  return {
    bucket,
    summary,
    options: STARTER_OPTION_LIBRARY[bucket.key] || STARTER_OPTION_LIBRARY['balanced-investor'],
    contributionSummary: `You said you can invest ${formatCurrency(monthly)} per month and currently have ${formatCurrency(cash)} available, so a simple repeatable structure matters more than chasing complexity early on.`,
  };
}

function renderStarterPlan(plan) {
  return `
    <div class="starter-stack">
      <section class="report-banner">
        <div>
          <p class="eyebrow small">Getting started investing</p>
          <h3>${plan.bucket.label}</h3>
          <p>${plan.summary}</p>
        </div>
        <div class="report-banner-meta">
          <span>${plan.bucket.style}</span>
        </div>
      </section>

      <section class="sub-card">
        <h4>Recommended style</h4>
        <p><strong>${plan.bucket.style}</strong></p>
        <p>${plan.bucket.styleMessage}</p>
      </section>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Suggested allocation</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.allocation.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
          <p>${plan.bucket.allocationMessage}</p>
        </section>
        <section class="sub-card">
          <h4>Profile fit</h4>
          <p>${plan.contributionSummary}</p>
          <p>Your biggest driver here is the combination of <strong>${plan.bucket.label.toLowerCase()}</strong> characteristics, especially your time horizon and risk tolerance.</p>
        </section>
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>What to invest in</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.investIn.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </section>
        <section class="sub-card">
          <h4>What not to lean on</h4>
          <ul class="metric-list compact-list">
            ${plan.bucket.avoid.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="breakdown-grid">
        ${plan.options.map((option) => `
          <section class="sub-card starter-option-card">
            <h4>${option.title}</h4>
            <p><strong>${option.focus}</strong></p>
            <ul class="metric-list compact-list">
              ${option.allocationLines.map((line) => `<li><span>${line}</span></li>`).join('')}
            </ul>
            <p>${option.examples}</p>
          </section>
        `).join('')}
      </div>
    </div>
  `;
}

function parseHoldings(holdingsText) {
  return String(holdingsText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*[—-]\s*([\$\d,.]+)$/);
      if (!match) {
        return { raw: line, symbol: '', amount: Number.NaN };
      }

      return {
        raw: line,
        symbol: match[1].trim().toUpperCase(),
        amount: Number(match[2].replace(/[\$,]/g, '').trim()),
      };
    });
}

function resolveSecurity(symbol, questionnaire = {}) {
  const exactSymbol = String(symbol || '').trim().toUpperCase();
  const normalizedSymbol = normalizeLookupKey(exactSymbol);

  if (SECURITY_INDEXES.exact[exactSymbol]) {
    return {
      ...SECURITY_INDEXES.exact[exactSymbol],
      matchLevel: 'exact',
      inputSymbol: exactSymbol,
    };
  }

  if (SECURITY_INDEXES.normalized[normalizedSymbol]) {
    return {
      ...SECURITY_INDEXES.normalized[normalizedSymbol],
      matchLevel: 'normalized',
      inputSymbol: exactSymbol,
    };
  }

  const assumedGeography = /UNITED STATES|USA|US/i.test(questionnaire.country || '') ? 'United States' : 'International';
  const looksLikeCrypto = /(BTC|XBT|ETH|SOL|BNB|XRP|DOGE|USDT|USDC)/i.test(exactSymbol);
  const looksLikeFund = /(ETF|FUND)$/i.test(exactSymbol) || exactSymbol.length > 5;
  const looksLikeBondFund = /(BOND|TREASURY|TIPS|AGG)/i.test(exactSymbol);

  return {
    symbol: exactSymbol || 'UNKNOWN',
    name: exactSymbol || 'Unknown security',
    type: looksLikeCrypto ? 'crypto' : looksLikeFund ? 'etf' : 'stock',
    assetType: looksLikeCrypto ? 'crypto' : looksLikeBondFund ? 'bond fund' : looksLikeFund ? 'ETF' : 'stock',
    category: looksLikeCrypto ? 'crypto asset' : looksLikeFund ? 'unclassified fund' : 'unclassified stock',
    etfCategory: looksLikeBondFund ? 'aggregate bonds' : looksLikeFund ? 'broad ETF' : 'n/a',
    strategyGroup: `fallback-${normalizedSymbol || 'unknown'}`,
    tags: looksLikeCrypto ? ['fallback-classification', 'crypto-asset'] : ['fallback-classification'],
    assetClass: looksLikeCrypto ? { alternatives: 1 } : looksLikeBondFund ? { bonds: 1 } : { equities: 1 },
    geography: { [assumedGeography]: 1 },
    domicile: assumedGeography,
    sector: looksLikeCrypto ? { Crypto: 1 } : { Unknown: 1 },
    aliases: [],
    indexedExposure: looksLikeFund && !looksLikeCrypto,
    matchLevel: 'fallback',
    inputSymbol: exactSymbol,
  };
}

function accumulateWeightedBreakdown(target, weights, value) {
  Object.entries(weights || {}).forEach(([key, weight]) => {
    target[key] = (target[key] || 0) + value * weight;
  });
}

function normalizeTotals(totals, totalValue) {
  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      weight: totalValue ? value / totalValue : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

function getAllocationWeight(items, name) {
  return items.find((item) => item.name === name)?.weight || 0;
}

function primaryBucket(items) {
  return items[0]?.name || 'Unknown';
}

const ARCHETYPE_PRIORITY = [
  'too-aggressive-for-timeline',
  'beginner-stock-picker',
  'concentrated-single-name-bet',
  'underinvested-long-term-investor',
  'redundant-etf-stack',
  'us-tech-heavy-growth-portfolio',
  'overcomplicated-beginner-portfolio',
  'balanced-diversified-portfolio',
];

const ARCHETYPE_LIBRARY = {
  'beginner-stock-picker': {
    label: 'Beginner stock picker',
    story: 'This portfolio is built mostly from individual stocks and lacks a diversified core, so performance depends too much on a small number of companies.',
    mainIssue: 'The biggest issue is not just concentration — it is the absence of a broad ETF foundation.',
    secondaryIssues: ['Fully or mostly U.S. exposure.', 'Higher company-specific risk.', 'Possible theme concentration.'],
    positives: ['You have already started investing.', 'You are holding more than one name.', 'There may be cash available to improve the structure.'],
    actions: ['Build a diversified ETF core first.', 'Reduce the percentage of the portfolio in individual stocks over time.', 'Add international diversification after the ETF core is established.'],
  },
  'concentrated-single-name-bet': {
    label: 'Concentrated single-name bet',
    story: 'A large portion of this portfolio is tied to one position, so results are being driven too heavily by a single holding.',
    mainIssue: 'The portfolio has an oversized position that creates unnecessary concentration risk.',
    secondaryIssues: ['Weaker diversification than the headline holdings count suggests.', 'Possible sector concentration.', 'Performance is tied to one company or fund.'],
    positives: ['You already have capital invested and something concrete to improve.', 'The portfolio can improve meaningfully with one or two focused changes.', 'New contributions can help dilute the oversized position over time.'],
    actions: ['Reduce the oversized holding closer to a more reasonable share of the portfolio.', 'Reallocate into broader diversified exposure.', 'Reassess whether this position size is intentional or accidental.'],
  },
  'us-tech-heavy-growth-portfolio': {
    label: 'U.S. tech heavy growth portfolio',
    story: 'This portfolio is built for growth, but much of that growth exposure is concentrated in U.S. tech rather than spread broadly.',
    mainIssue: 'The main risk is that the portfolio is effectively making one large bet on U.S. technology.',
    secondaryIssues: ['High U.S. concentration.', 'High sector concentration.', 'Possible overlap across similar growth holdings.'],
    positives: ['The portfolio does have a clear growth orientation.', 'You have already built exposure to long-term equity assets.', 'The structure can improve without giving up growth entirely.'],
    actions: ['Keep the growth orientation if it fits the profile, but reduce dependence on U.S. tech.', 'Add broader market and international exposure.', 'Make sure no single stock or sector dominates the portfolio.'],
  },
  'redundant-etf-stack': {
    label: 'Redundant ETF stack',
    story: 'This portfolio contains multiple funds with overlapping exposure, so it is more complicated than it needs to be without adding much diversification.',
    mainIssue: 'The main problem is redundancy, not lack of diversification.',
    secondaryIssues: ['Multiple funds may be tracking similar markets.', 'Complexity is higher than necessary.', 'Weight may be unintentionally concentrated despite many tickers.'],
    positives: ['You are already thinking in terms of diversified funds.', 'Most of the improvement can come from simplification rather than a full rebuild.', 'The portfolio likely already has a usable core hidden inside it.'],
    actions: ['Simplify into fewer core ETFs.', 'Remove overlapping funds that serve the same purpose.', 'Rebuild around a cleaner allocation structure.'],
  },
  'underinvested-long-term-investor': {
    label: 'Underinvested long-term investor',
    story: 'This profile supports long-term growth, but a large portion of the portfolio is sitting in cash or defensive assets.',
    mainIssue: 'The portfolio is too conservative for the stated horizon and risk tolerance.',
    secondaryIssues: ['Long-term growth potential may be reduced.', 'Allocation does not match the stated goals.', 'Cash may be creating drag.'],
    positives: ['The conservative allocation does provide stability.', 'You may already have liquidity available to improve the allocation.', 'A gradual plan can fix this without requiring a sudden all-in move.'],
    actions: ['Decide how much cash truly needs to stay liquid.', 'Gradually invest the excess into the target allocation.', 'Set up recurring contributions so the portfolio keeps moving toward its goal.'],
  },
  'too-aggressive-for-timeline': {
    label: 'Too aggressive for the timeline',
    story: 'This portfolio may be suitable for long-term growth, but it looks too aggressive for money that may be needed soon.',
    mainIssue: 'The portfolio’s risk level does not match the time horizon.',
    secondaryIssues: ['Equity exposure may be too high.', 'Volatility could be damaging if the money is needed on schedule.', 'Individual stocks may add extra instability.'],
    positives: ['You do already have invested assets rather than idle money only.', 'The portfolio can become more appropriate with a risk reset rather than a full restart.', 'Your holdings can still support future long-term investing in the right account or bucket.'],
    actions: ['Reduce risk and increase safety.', 'Increase safer holdings such as cash or bonds.', 'Focus on protecting capital rather than maximizing upside.'],
  },
  'overcomplicated-beginner-portfolio': {
    label: 'Overcomplicated beginner portfolio',
    story: 'This portfolio has more moving parts than necessary for a beginner and may be harder to manage than the investor needs.',
    mainIssue: 'Complexity is too high relative to the goal and experience level.',
    secondaryIssues: ['Overlapping holdings.', 'Hard-to-track allocation.', 'Unclear core structure.'],
    positives: ['You have already taken action and built a real portfolio.', 'The portfolio likely contains useful pieces that can be retained.', 'Simplifying can improve results and confidence at the same time.'],
    actions: ['Simplify into a small number of core positions.', 'Remove unnecessary overlap.', 'Use a cleaner ETF-based structure going forward.'],
  },
  'balanced-diversified-portfolio': {
    label: 'Balanced diversified portfolio',
    story: 'This portfolio already has a solid diversified base and broadly aligns with the investor’s profile.',
    mainIssue: 'There is no major structural problem, only smaller improvements.',
    secondaryIssues: ['Minor concentration or overlap may exist.', 'Allocation could be tuned slightly.', 'Consistency may matter more than changes.'],
    positives: ['The portfolio already has a usable diversified foundation.', 'The allocation broadly matches the stated profile.', 'You likely need discipline more than a major rebuild.'],
    actions: ['Keep the core structure in place.', 'Make only targeted improvements if needed.', 'Stay consistent with contributions and avoid unnecessary changes.'],
  },
};

function hasAnyTag(holding, tags) {
  return tags.some((tag) => holding.metadata.tags.includes(tag));
}

function scoreArchetypes(summary, groupedThemes, questionnaire, rules = []) {
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const bondsWeight = getAllocationWeight(summary.assetClassTotals, 'bonds');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const topHolding = summary.holdings[0];
  const topSector = summary.sectorTotals[0];
  const topGeography = summary.geographyTotals[0];
  const holdingCount = summary.holdings.length;
  const broadFoundationCount = summary.holdings.filter((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market', 'international-core'])).length;
  const overlappingBroadEtfs = summary.holdings.filter((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market'])).length;
  const singleStockHoldings = summary.holdings.filter((holding) => holding.metadata.type === 'stock');
  const singleStockWeight = singleStockHoldings.reduce((sum, holding) => sum + holding.weight, 0);
  const popularNames = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'GOOGL', 'NFLX'];
  const popularNameCount = singleStockHoldings.filter((holding) => popularNames.includes(holding.symbol)).length;
  const weakSectorDiversification = (topSector?.weight || 0) >= 0.35;
  const weakGeographyDiversification = (topGeography?.weight || 0) >= 0.8;
  const duplicateTheme = groupedThemes.some((theme) => theme.theme === 'overlap');
  const concentrationTheme = groupedThemes.some((theme) => theme.theme === 'concentration');
  const deploymentTheme = groupedThemes.some((theme) => theme.theme === 'deployment');
  const riskTheme = groupedThemes.some((theme) => theme.theme === 'risk-mismatch');
  const shortHorizon = questionnaire?.timeHorizon === 'less than 3 years' || questionnaire?.mainGoal === 'save for big purchase';
  const longHorizon = questionnaire?.timeHorizon === '7+ years';
  const beginner = questionnaire?.experience === 'beginner';
  const mediumOrHighRisk = ['medium', 'high'].includes(questionnaire?.riskTolerance);
  const topTwoHoldings = summary.holdings.slice(0, 2);
  const topTwoTechHeavy = topTwoHoldings.filter((holding) => ['Technology', 'CommunicationServices'].includes(holding.primarySector)).length >= Math.min(2, topTwoHoldings.length || 0);
  const lowIssueCount = groupedThemes.length <= 1 && (topHolding?.weight || 0) < 0.25;
  const hasInternationalDiversification = (summary.geographyTotals.find((item) => item.name === 'International')?.weight || 0) >= 0.15;
  const scores = {};

  if (shortHorizon && (equitiesWeight > 0.7 || singleStockWeight > 0.45)) {
    scores['too-aggressive-for-timeline'] = 100 + Math.round(equitiesWeight * 10);
  }

  if (broadFoundationCount === 0 && holdingCount >= 3 && holdingCount <= 6 && singleStockWeight >= 0.65 && (weakSectorDiversification || weakGeographyDiversification || popularNameCount >= 2)) {
    scores['beginner-stock-picker'] = 96 + Math.round(singleStockWeight * 10);
  }

  const weakDiversification = weakSectorDiversification || weakGeographyDiversification || singleStockWeight > 0.65;
  const pureOverlapPortfolio = duplicateTheme && singleStockWeight < 0.2;
  if (!pureOverlapPortfolio && topHolding && (topHolding.weight > 0.4 || (topHolding.weight > 0.25 && concentrationTheme && weakDiversification))) {
    scores['concentrated-single-name-bet'] = 94 + Math.round(topHolding.weight * 10);
  }

  if (longHorizon && mediumOrHighRisk && (cashWeight > 0.15 || equitiesWeight < 0.55 || deploymentTheme)) {
    scores['underinvested-long-term-investor'] = 92 + Math.round((cashWeight + Math.max(0, 0.55 - equitiesWeight)) * 10);
  }

  if (duplicateTheme && (overlappingBroadEtfs >= 2 || rules.some((rule) => rule.title.includes('redundant exposure')))) {
    scores['redundant-etf-stack'] = 90 + overlappingBroadEtfs;
  }

  if ((topGeography?.name === 'United States' && topGeography.weight > 0.75) && (topSector?.name === 'Technology' && topSector.weight > 0.35) && topTwoTechHeavy) {
    scores['us-tech-heavy-growth-portfolio'] = 88 + Math.round((topSector.weight + topGeography.weight) * 5);
  }

  if (beginner && holdingCount > 8 && (singleStockWeight > 0.35 || duplicateTheme)) {
    scores['overcomplicated-beginner-portfolio'] = 86 + Math.min(10, holdingCount - 8);
  }

  if (broadFoundationCount >= 1 && !riskTheme && !concentrationTheme && !deploymentTheme && hasInternationalDiversification && lowIssueCount) {
    scores['balanced-diversified-portfolio'] = 84;
  }

  return scores;
}

function classifyArchetype(summary, groupedThemes, questionnaire, rules = []) {
  const scores = scoreArchetypes(summary, groupedThemes, questionnaire, rules);
  const eligible = ARCHETYPE_PRIORITY.filter((key) => scores[key]);
  const primaryKey = eligible[0] || 'balanced-diversified-portfolio';
  const secondaryKey = eligible.find((key) => key !== primaryKey && scores[key] >= scores[primaryKey] - 12) || null;

  return {
    primary: { key: primaryKey, score: scores[primaryKey] || 80, ...ARCHETYPE_LIBRARY[primaryKey] },
    secondary: secondaryKey ? { key: secondaryKey, score: scores[secondaryKey], ...ARCHETYPE_LIBRARY[secondaryKey] } : null,
    label: secondaryKey ? `${ARCHETYPE_LIBRARY[primaryKey].label} + ${ARCHETYPE_LIBRARY[secondaryKey].label}` : ARCHETYPE_LIBRARY[primaryKey].label,
    diagnosis: ARCHETYPE_LIBRARY[primaryKey].story,
  };
}

function createRule(theme, severity, priorityScore, title, detail, recommendation) {
  return { theme, severity, priorityScore, title, detail, recommendation };
}

function pushRule(rules, condition, rule) {
  if (condition) {
    rules.push(rule);
  }
}

function groupRules(rules) {
  const grouped = {};
  rules.forEach((rule) => {
    if (!grouped[rule.theme]) {
      grouped[rule.theme] = { theme: rule.theme, priorityScore: 0, rules: [] };
    }
    grouped[rule.theme].rules.push(rule);
    grouped[rule.theme].priorityScore = Math.max(grouped[rule.theme].priorityScore, rule.priorityScore);
  });

  return Object.values(grouped)
    .map((group) => ({
      ...group,
      avgPriority: Math.round(group.rules.reduce((sum, rule) => sum + rule.priorityScore, 0) / group.rules.length),
      headline: group.rules[0]?.title || 'Theme',
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function generatePositiveSignals(summary, questionnaire) {
  const positives = [];
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const topSector = summary.sectorTotals[0];
  const topGeography = summary.geographyTotals[0];
  const broadCoreCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('broad-us-etf') || holding.metadata.tags.includes('all-equity-broad-market')).length;
  const matchedKnown = summary.matchStats.exact + summary.matchStats.normalized;
  const monthlyContribution = Number(questionnaire?.monthlyAmount || 0);

  if (broadCoreCount >= 1) {
    positives.push('You already have at least one broad ETF that can serve as a solid core holding.');
  }

  if (summary.holdings.length >= 4 && summary.holdings.length <= 20) {
    positives.push('Your number of holdings is still manageable, which makes the portfolio easier to monitor and improve.');
  }

  if (topSector && topSector.weight <= 0.35) {
    positives.push(`No single sector dominates the portfolio, with ${toTitleLabel(topSector.name)} as the largest at ${formatPercent(topSector.weight)}.`);
  }

  if (topGeography && topGeography.weight <= 0.65) {
    positives.push('Your geography mix is not overly tied to one region, which helps reduce country-specific risk.');
  }

  if (monthlyContribution > 0) {
    positives.push(`You entered ${formatCurrency(monthlyContribution)} as a monthly contribution, which is a strong long-term habit.`);
  }

  if (cashWeight > 0 && cashWeight <= 0.1) {
    positives.push(`Only ${formatPercent(cashWeight)} of the portfolio is in cash, so most of the account is already invested.`);
  }

  if (matchedKnown === summary.holdings.length) {
    positives.push('Every holding matched the metadata library cleanly, so the portfolio read is based on known sector and geography data.');
  }

  return positives.slice(0, 4);
}

function buildDeterministicActionSteps(summary, groupedThemes, primaryArchetype) {
  const hasEtfFoundation = summary.holdings.some((holding) => hasAnyTag(holding, ['broad-us-etf', 'all-equity-broad-market', 'international-core']));
  const largestHoldingWeight = summary.holdings[0]?.weight || 0;
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const shortHorizonMismatch = groupedThemes.some((theme) => theme.theme === 'risk-mismatch') && primaryArchetype.key === 'too-aggressive-for-timeline';
  const overlapMainIssue = primaryArchetype.key === 'redundant-etf-stack';
  const cashDragMainIssue = primaryArchetype.key === 'underinvested-long-term-investor';
  const actions = [...primaryArchetype.actions];

  if (!hasEtfFoundation) {
    actions.unshift('Build a diversified ETF core first.');
  }
  if (largestHoldingWeight > 0.25) {
    actions.splice(1, 0, 'Reduce the oversized holding closer to a more reasonable share of the portfolio.');
  }
  if (overlapMainIssue) {
    actions.unshift('Simplify and remove redundancy.');
  }
  if (cashDragMainIssue || cashWeight > 0.15) {
    actions.unshift('Decide how much cash is intentional, then invest the rest gradually.');
  }
  if (shortHorizonMismatch) {
    actions.unshift('Reduce risk and increase safety.');
  }
  if (primaryArchetype.key === 'balanced-diversified-portfolio') {
    actions.unshift('Keep the core structure and make only minor adjustments.');
  }

  return [...new Set(actions)].slice(0, 3);
}

function buildNarrative(summary, questionnaire, groupedThemes, positives, archetype) {
  const primaryArchetype = archetype.primary;
  const secondaryArchetype = archetype.secondary;
  const topHolding = summary.holdings[0];
  const topSector = summary.sectorTotals[0];
  const contextualSecondary = [...primaryArchetype.secondaryIssues];

  if (secondaryArchetype) {
    contextualSecondary.unshift(`Secondary archetype: ${secondaryArchetype.label}.`);
  }
  if (topHolding && !contextualSecondary.some((item) => item.includes(topHolding.symbol))) {
    contextualSecondary.push(`${topHolding.symbol} is currently the largest holding at ${formatPercent(topHolding.weight)}.`);
  }
  if (topSector && !contextualSecondary.some((item) => item.includes(toTitleLabel(topSector.name)))) {
    contextualSecondary.push(`${toTitleLabel(topSector.name)} is the largest sector at ${formatPercent(topSector.weight)}.`);
  }

  return {
    diagnosis: primaryArchetype.story,
    archetypeLabel: archetype.label,
    primaryArchetype,
    secondaryArchetype,
    profileFit: `Profile context: ${questionnaire?.riskTolerance || 'medium'} risk tolerance, ${questionnaire?.timeHorizon || 'long-term'} horizon, and goal of ${questionnaire?.mainGoal || 'long-term growth'}.`,
    mainIssue: primaryArchetype.mainIssue,
    secondaryIssues: contextualSecondary.slice(0, 3),
    whatWorking: [...primaryArchetype.positives, ...positives].slice(0, 3),
    actionSteps: buildDeterministicActionSteps(summary, groupedThemes, primaryArchetype),
  };
}

function computePortfolioHealth(groupedThemes, positives) {
  const topPenalty = groupedThemes.slice(0, 5).reduce((sum, theme) => {
    const themePenalty = theme.rules.reduce((acc, rule) => acc + (SEVERITY_WEIGHTS[rule.severity] || 4), 0);
    return sum + Math.min(24, themePenalty + Math.round((theme.priorityScore - 50) / 8));
  }, 0);

  const positiveOffset = Math.min(12, positives.length * 3);
  const score = Math.max(0, Math.min(100, Math.round(100 - topPenalty + positiveOffset)));
  const label = score >= 85 ? 'Strong' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : 'Needs attention';
  return { score, label };
}

function generateRules(summary, questionnaire) {
  const rules = [];
  const age = Number(questionnaire?.age || 0);
  const monthlyContribution = Number(questionnaire?.monthlyAmount || 0);
  const currentCashAvailable = Number(questionnaire?.currentCash || 0);
  const largestHolding = summary.holdings[0];
  const topGeography = summary.geographyTotals[0];
  const topSector = summary.sectorTotals[0];
  const equitiesWeight = getAllocationWeight(summary.assetClassTotals, 'equities');
  const bondsWeight = getAllocationWeight(summary.assetClassTotals, 'bonds');
  const cashWeight = getAllocationWeight(summary.assetClassTotals, 'cash');
  const cashAndBondsWeight = cashWeight + bondsWeight;
  const holdingCount = summary.holdings.length;
  const broadUsEtfCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('broad-us-etf')).length;
  const allEquityBroadMarketCount = summary.holdings.filter((holding) => holding.metadata.tags.includes('all-equity-broad-market')).length;
  const singleStockHoldings = summary.holdings.filter((holding) => holding.metadata.type === 'stock');
  const singleStockCount = singleStockHoldings.length;
  const onlySingleStocks = singleStockCount === holdingCount;
  const hasBroadEtf = summary.holdings.some((holding) => holding.metadata.tags.includes('broad-us-etf') || holding.metadata.tags.includes('all-equity-broad-market'));
  const duplicateStrategies = summary.strategyExposure.filter((item) => item.weight >= 0.2).length >= 2;
  const topTwoHoldings = summary.holdings.slice(0, 2);
  const topTwoSameSector = topTwoHoldings.length === 2 && topTwoHoldings[0].primarySector === topTwoHoldings[1].primarySector;
  const broadEtfPlusIndexedStocks = hasBroadEtf && singleStockHoldings.filter((holding) => holding.metadata.indexedExposure).length >= 2;
  const fallbackCount = summary.matchStats.fallback;
  const horizon = questionnaire?.timeHorizon;
  const risk = questionnaire?.riskTolerance;
  const goal = questionnaire?.mainGoal;

  if (largestHolding) {
    pushRule(rules, holdingCount === 1, createRule('concentration', 'high', 98, 'Single holding concentration is very high', `your portfolio has only one holding, so ${largestHolding.symbol} represents ${formatPercent(largestHolding.weight)} of the account.`, 'Add at least a few diversified building blocks so one holding does not determine nearly all of your outcome.'));
    pushRule(rules, holdingCount >= 2 && holdingCount <= 3, createRule('diversification', 'medium', 76, 'Portfolio breadth is limited', `you currently hold only ${holdingCount} positions, which leaves the portfolio exposed to company-specific surprises.`, 'Broaden the core with a diversified ETF or a few clearly different holdings.'));
    pushRule(rules, largestHolding.weight > 0.4, createRule('concentration', 'high', 94, 'Largest holding is above 40%', `${largestHolding.symbol} makes up ${formatPercent(largestHolding.weight)} of the portfolio, which is a high concentration risk.`, `Trim ${largestHolding.symbol} gradually or let other holdings catch up through new contributions.`));
    pushRule(rules, largestHolding.weight > 0.25 && largestHolding.weight <= 0.4, createRule('concentration', 'medium', 84, 'Largest holding is above 25%', `${largestHolding.symbol} represents ${formatPercent(largestHolding.weight)}, so one position is driving a lot of the outcome.`, 'Redirect new money toward other exposures so the portfolio becomes less dependent on one holding.'));
    pushRule(rules, largestHolding.weight > 0.15 && largestHolding.metadata.type === 'stock', createRule('concentration', 'low/medium', 67, 'A single stock is above 15%', `${largestHolding.symbol} is an individual stock at ${formatPercent(largestHolding.weight)}, which is a meaningful company-specific bet.`, 'Keep individual stocks as satellites around a diversified core unless this overweight is very intentional.'));
  }

  pushRule(rules, holdingCount > 30, createRule('overlap', 'medium', 68, 'Portfolio may be too crowded', `you hold ${holdingCount} positions, which can make the portfolio harder to monitor and may indicate overlapping ideas.`, 'Consolidate overlapping positions into fewer core holdings with clear jobs.'));
  pushRule(rules, holdingCount > 20 && holdingCount <= 30, createRule('overlap', 'low/medium', 56, 'You may have more holdings than you need', `at ${holdingCount} holdings, diversification may already be sufficient and complexity may be rising.`, 'Review whether each position adds something unique before adding more names.'));
  pushRule(rules, holdingCount <= 2 && holdingCount > 0 && singleStockCount === holdingCount, createRule('diversification', 'high', 92, 'One or two single stocks create a fragile portfolio', 'a portfolio built entirely from one or two individual stocks can swing sharply based on company-specific news.', 'Add a broad market ETF first, then decide how much room remains for stock ideas.'));
  pushRule(rules, onlySingleStocks && !hasBroadEtf, createRule('diversification', 'medium/high', 80, 'Portfolio relies only on single stocks', 'all current holdings are individual stocks and there is no broad ETF anchor to spread risk across more companies.', 'Use a broad ETF as the foundation and keep stock picks as a smaller sleeve.'));

  if (topGeography) {
    pushRule(rules, topGeography.weight > 0.8, createRule('diversification', 'high', 90, 'Geography exposure is heavily concentrated', `${topGeography.name} accounts for ${formatPercent(topGeography.weight)} of the portfolio.`, 'Add exposure to other regions if you want a broader all-market mix rather than a one-country bet.'));
    pushRule(rules, topGeography.weight > 0.65 && topGeography.weight <= 0.8, createRule('diversification', 'medium', 78, 'Geography exposure is somewhat concentrated', `${topGeography.name} is ${formatPercent(topGeography.weight)} of the portfolio, so regional diversification could improve.`, 'Consider adding a broad international fund or other geographic diversifier.'));
  }

  if (topSector) {
    pushRule(rules, topSector.weight > 0.5 && topTwoSameSector, createRule('concentration', 'high', 89, 'Your portfolio is heavily tied to one theme', `${toTitleLabel(topSector.name)} is ${formatPercent(topSector.weight)} of the portfolio and your top two holdings are both in that same sector.`, 'Reduce the theme concentration by trimming overlapping holdings or adding underrepresented sectors.'));
    pushRule(rules, topSector.weight > 0.5, createRule('concentration', 'high', 88, 'Sector exposure is above 50%', `${toTitleLabel(topSector.name)} makes up ${formatPercent(topSector.weight)} of the portfolio.`, 'Add positions in other sectors or use a broader fund so one market theme does not dominate the whole account.'));
    pushRule(rules, topSector.weight > 0.35 && topSector.weight <= 0.5, createRule('concentration', 'medium/high', 76, 'Sector exposure is above 35%', `${toTitleLabel(topSector.name)} is ${formatPercent(topSector.weight)} of the portfolio, so returns may be driven by one part of the market.`, 'Direct future purchases toward sectors that are currently much smaller in the portfolio.'));
  }

  pushRule(rules, broadEtfPlusIndexedStocks, createRule('overlap', 'medium', 74, 'You may have redundant exposure', 'you own a broad U.S. ETF and also multiple U.S. stocks that are probably already inside that index.', 'Decide whether the stock picks are intentional overweights; if not, simplify and lean more on the ETF.'));
  pushRule(rules, broadUsEtfCount >= 2, createRule('overlap', 'useful', 60, 'You hold multiple broad U.S. ETFs', 'owning two or more broad U.S. equity ETFs can create overlap without adding much diversification.', 'If the funds serve the same role, keep the one you prefer on simplicity, cost, or account location.'));
  pushRule(rules, allEquityBroadMarketCount >= 2, createRule('overlap', 'useful', 63, 'Multiple all-equity broad market ETFs overlap', 'two or more all-equity broad market ETFs often duplicate much of the same exposure.', 'Keeping one main all-equity fund usually makes the portfolio easier to maintain.'));
  pushRule(rules, duplicateStrategies, createRule('overlap', 'useful', 58, 'Strategy exposure appears duplicated', 'several holdings point to similar strategy buckets, so the lineup may be more complex than it needs to be.', 'Look for holdings that play nearly the same role and consolidate where appropriate.'));

  pushRule(rules, equitiesWeight >= 0.995 && risk === 'low', createRule('risk-mismatch', 'high', 92, '100% equities looks too aggressive for a low-risk profile', 'your portfolio is effectively all equities, but your questionnaire says your risk tolerance is low.', 'Add bonds or cash reserves so the portfolio better matches the amount of volatility you can tolerate.'));
  pushRule(rules, equitiesWeight >= 0.995 && risk === 'medium', createRule('risk-mismatch', 'medium', 74, '100% equities may be aggressive for a medium-risk profile', 'an all-equity portfolio can be more aggressive than many medium-risk investors expect.', 'Consider whether a modest bond or cash sleeve would make it easier to stay invested through drawdowns.'));
  pushRule(rules, risk === 'low' && equitiesWeight > 0.8, createRule('risk-mismatch', 'medium/high', 86, 'Allocation may not match a low-risk profile', `a low-risk profile paired with ${formatPercent(equitiesWeight)} in equities looks more aggressive than expected.`, 'Shift part of the portfolio toward bonds or cash-like holdings if stability matters more than maximum growth.'));
  pushRule(rules, risk === 'high' && cashAndBondsWeight > 0.35, createRule('risk-mismatch', 'medium/high', 84, 'Allocation may not match a high-risk profile', `a high-risk profile paired with ${formatPercent(cashAndBondsWeight)} in cash and bonds may be more conservative than intended.`, 'If your goal is aggressive long-term growth, consider redeploying part of the conservative sleeve into diversified equities.'));
  pushRule(rules, horizon === 'less than 3 years' && equitiesWeight > 0.85, createRule('risk-mismatch', 'high', 90, 'Short horizon with very high equity exposure', `with a horizon under 3 years, keeping ${formatPercent(equitiesWeight)} in equities can create too much volatility before the money is needed.`, 'Move at least part of the portfolio into lower-volatility assets for the near-term goal.'));
  pushRule(rules, horizon === 'less than 3 years' && equitiesWeight > 0.7 && equitiesWeight <= 0.85, createRule('risk-mismatch', 'medium', 75, 'Short horizon still looks equity-heavy', `a portfolio with ${formatPercent(equitiesWeight)} in equities may be too volatile for money needed within 3 years.`, 'Bring more of the near-term money into bonds or cash-like assets.'));
  pushRule(rules, horizon === '7+ years' && equitiesWeight < 0.4, createRule('deployment', 'high', 82, 'Long horizon looks unusually conservative', `with a 7+ year horizon, only ${formatPercent(equitiesWeight)} in equities may leave growth potential on the table.`, 'If the money is truly long-term, consider increasing diversified equity exposure gradually over time.'));
  pushRule(rules, horizon === '7+ years' && equitiesWeight < 0.5 && equitiesWeight >= 0.4, createRule('deployment', 'medium', 71, 'Long horizon may support more growth exposure', `at ${formatPercent(equitiesWeight)} in equities, the portfolio is on the conservative side for a 7+ year horizon.`, 'You could direct some new contributions toward diversified equities if long-term growth is the goal.'));
  pushRule(rules, goal === 'save for big purchase' && equitiesWeight > 0.65, createRule('risk-mismatch', 'medium/high', 83, 'Big purchase goal may need a steadier mix', `because the goal is a big purchase, having ${formatPercent(equitiesWeight)} in equities may expose the money to too much short-term market risk.`, 'Match the portfolio to the purchase timeline by moving more of that goal money into lower-volatility assets.'));
  pushRule(rules, age < 35 && horizon === '7+ years' && equitiesWeight < 0.6, createRule('deployment', 'medium', 72, 'Long horizon may support more growth exposure', `at age ${age} with a 7+ year horizon, only ${formatPercent(equitiesWeight)} in equities may be more conservative than necessary.`, 'If you are comfortable with market swings, you may want a somewhat higher allocation to diversified equities over time.'));
  pushRule(rules, age < 30 && goal === 'grow your wealth long term' && risk === 'high' && cashAndBondsWeight > 0.4, createRule('deployment', 'medium', 76, 'Aggressive profile still holds a lot in cash or bonds', `for a younger investor seeking long-term growth with high risk tolerance, ${formatPercent(cashAndBondsWeight)} in cash and bonds may slow the portfolio down.`, 'If that conservative allocation is not intentional, shift part of it into diversified equities gradually.'));
  pushRule(rules, risk === 'high' && horizon === '7+ years' && cashWeight > 0.15, createRule('deployment', 'medium/high', 78, 'Cash level is high for a long-term aggressive profile', `a high-risk investor with a 7+ year horizon currently has ${formatPercent(cashWeight)} in cash.`, 'If the cash is not reserved for a near-term use, consider phasing it into the target portfolio over time.'));
  pushRule(rules, risk === 'medium' && horizon === '7+ years' && cashWeight > 0.2, createRule('deployment', 'medium', 69, 'Cash level is moderately high for a long-term balanced profile', `a medium-risk investor with a 7+ year horizon currently has ${formatPercent(cashWeight)} in cash.`, 'If that cash is meant for long-term investing, a gradual deployment plan could help it start working harder.'));
  pushRule(rules, cashWeight > 0.1 && monthlyContribution <= 0, createRule('deployment', 'medium', 74, 'You are not actively building the portfolio', `you currently hold ${formatPercent(cashWeight)} in cash and have no monthly contribution entered.`, 'Set up even a modest recurring contribution or create a schedule for putting idle cash to work.'));
  pushRule(rules, monthlyContribution <= 0 && currentCashAvailable > 0 && (horizon === '7+ years' || goal === 'retirement' || goal === 'grow your wealth long term'), createRule('deployment', 'medium', 68, 'No ongoing monthly contribution is set', 'you have investable cash today, but no monthly contribution entered. For long-term goals, regular contributions usually matter a lot.', 'Add a recurring monthly amount, even if small, so the portfolio continues to grow beyond the money already available today.'));
  pushRule(rules, fallbackCount > 0, createRule('coverage', 'useful', 52, 'Some holdings used fallback classification', `${fallbackCount} holding${fallbackCount > 1 ? 's were' : ' was'} not found in the local metadata library, so sector and geography were estimated instead of matched exactly.`, 'Review those tickers carefully, because adding more precise security data would improve the confidence of the analysis.'));

  return rules.sort((a, b) => b.priorityScore - a.priorityScore);
}

function analyzePortfolio(holdings, questionnaire) {
  const enrichedHoldings = holdings.map((holding) => {
    const metadata = resolveSecurity(holding.symbol, questionnaire);
    return {
      ...holding,
      metadata,
      isSingleStock: metadata.type === 'stock',
      primarySector: primaryBucket(normalizeTotals(metadata.sector, 1)),
      primaryGeography: primaryBucket(normalizeTotals(metadata.geography, 1)),
    };
  });

  const totalValue = enrichedHoldings.reduce((sum, holding) => sum + holding.amount, 0);
  const weightedHoldings = enrichedHoldings
    .map((holding) => ({ ...holding, weight: totalValue ? holding.amount / totalValue : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const assetClassTotals = {};
  const geographyTotals = {};
  const sectorTotals = {};
  const categoryTotals = {};
  const strategyExposure = {};
  const matchStats = { exact: 0, normalized: 0, fallback: 0 };

  weightedHoldings.forEach((holding) => {
    accumulateWeightedBreakdown(assetClassTotals, holding.metadata.assetClass, holding.amount);
    accumulateWeightedBreakdown(geographyTotals, holding.metadata.geography, holding.amount);
    accumulateWeightedBreakdown(sectorTotals, holding.metadata.sector, holding.amount);
    categoryTotals[holding.metadata.category] = (categoryTotals[holding.metadata.category] || 0) + holding.amount;
    strategyExposure[holding.metadata.strategyGroup] = (strategyExposure[holding.metadata.strategyGroup] || 0) + holding.amount;
    matchStats[holding.metadata.matchLevel] += 1;
  });

  const concentrationScore = weightedHoldings.slice(0, 3).reduce((sum, holding) => sum + holding.weight, 0);
  const summary = {
    totalValue,
    holdings: weightedHoldings,
    assetClassTotals: normalizeTotals(assetClassTotals, totalValue),
    geographyTotals: normalizeTotals(geographyTotals, totalValue),
    sectorTotals: normalizeTotals(sectorTotals, totalValue),
    categoryTotals: normalizeTotals(categoryTotals, totalValue),
    strategyExposure: normalizeTotals(strategyExposure, totalValue),
    matchStats,
    concentration: {
      largestHoldingWeight: weightedHoldings[0]?.weight || 0,
      topThreeWeight: concentrationScore,
    },
  };

  const rules = generateRules(summary, questionnaire);
  const groupedThemes = groupRules(rules);
  const positives = generatePositiveSignals(summary, questionnaire);
  const archetype = classifyArchetype(summary, groupedThemes, questionnaire, rules);
  const narrative = buildNarrative(summary, questionnaire, groupedThemes, positives, archetype);
  const health = computePortfolioHealth(groupedThemes, positives);

  return {
    ...summary,
    rules,
    groupedThemes,
    positives,
    archetype,
    narrative,
    health,
  };
}

function savePortfolio(analysis) {
  state.portfolio = analysis;
  try {
    window.localStorage.setItem('investAdvicePortfolio', JSON.stringify(analysis));
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }
}

function renderBreakdownList(items) {
  return `
    <ul class="metric-list">
      ${items
        .map(
          (item) => `
            <li>
              <span>${toTitleLabel(item.name)}</span>
              <span>${formatCurrency(item.value)} • ${formatPercent(item.weight)}</span>
            </li>
          `
        )
        .join('')}
    </ul>
  `;
}

function renderBarChart(items, chartClass) {
  return `
    <div class="chart-list">
      ${items
        .slice(0, 6)
        .map(
          (item) => `
            <div class="chart-row">
              <div class="chart-labels">
                <span>${toTitleLabel(item.name)}</span>
                <span>${formatPercent(item.weight)}</span>
              </div>
              <div class="chart-track">
                <div class="chart-fill ${chartClass}" style="width: ${Math.max(item.weight * 100, 2)}%"></div>
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderPieChart(items, title) {
  const topItems = items.slice(0, 5);
  const remainder = Math.max(0, 1 - topItems.reduce((sum, item) => sum + item.weight, 0));
  const slices = remainder > 0.01 ? [...topItems, { name: 'Other', weight: remainder }] : topItems;
  let offset = 0;
  const gradient = slices
    .map((item, index) => {
      const start = offset * 100;
      offset += item.weight;
      const end = offset * 100;
      return `${PALETTE[index % PALETTE.length]} ${start}% ${end}%`;
    })
    .join(', ');

  return `
    <section class="sub-card pie-card">
      <h4>${title}</h4>
      <div class="pie-layout">
        <div class="pie-chart" style="background: conic-gradient(${gradient || '#334155 0 100%'});"></div>
        <ul class="legend-list">
          ${slices
            .map(
              (item, index) => `
                <li>
                  <span class="legend-swatch" style="background:${PALETTE[index % PALETTE.length]}"></span>
                  <span>${toTitleLabel(item.name)}</span>
                  <strong>${formatPercent(item.weight)}</strong>
                </li>
              `
            )
            .join('')}
        </ul>
      </div>
    </section>
  `;
}

function renderThemes(groupedThemes) {
  if (!groupedThemes.length) {
    return `
      <section class="sub-card">
        <h4>Portfolio themes</h4>
        <p>No major risk theme stood out from the current portfolio snapshot.</p>
      </section>
    `;
  }

  return `
    <section class="sub-card">
      <h4>Portfolio themes</h4>
      <div class="theme-grid">
        ${groupedThemes
          .slice(0, 4)
          .map(
            (theme) => `
              <article class="theme-card">
                <p class="theme-label">${toTitleLabel(theme.theme)}</p>
                <strong>Priority ${theme.priorityScore}</strong>
                <p>${theme.rules[0].title}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderNarrative(analysis) {
  const secondaryArchetype = analysis.narrative.secondaryArchetype;
  return `
    <section class="sub-card narrative-card">
      <div class="narrative-header">
        <div>
          <p class="eyebrow small">Portfolio archetype</p>
          <h4>${analysis.narrative.primaryArchetype.label}</h4>
          ${secondaryArchetype ? `<p class="secondary-archetype"><strong>Secondary archetype:</strong> ${secondaryArchetype.label}</p>` : ''}
          <p class="status-copy">${analysis.narrative.profileFit}</p>
        </div>
        <div class="match-pill-group">
          <span class="match-pill">Exact: ${analysis.matchStats.exact}</span>
          <span class="match-pill">Normalized: ${analysis.matchStats.normalized}</span>
          <span class="match-pill">Fallback: ${analysis.matchStats.fallback}</span>
        </div>
      </div>
      <div class="narrative-grid">
        <article>
          <h5>Section 1: Portfolio diagnosis</h5>
          <p>${analysis.narrative.diagnosis}</p>
        </article>
        <article>
          <h5>Section 2: Main issue</h5>
          <p>${analysis.narrative.mainIssue}</p>
        </article>
        <article>
          <h5>Section 3: Secondary issues</h5>
          <ul class="metric-list compact-list">
            ${analysis.narrative.secondaryIssues.map((issue) => `<li><span>${issue}</span></li>`).join('')}
          </ul>
        </article>
        <article>
          <h5>Section 4: What’s working</h5>
          <ul class="metric-list compact-list">
            ${analysis.narrative.whatWorking.map((item) => `<li><span>${item}</span></li>`).join('')}
          </ul>
        </article>
        <article class="full-width">
          <h5>Section 5: What to do next</h5>
          <ol class="action-list">
            ${analysis.narrative.actionSteps.map((step) => `<li>${step}</li>`).join('')}
          </ol>
        </article>
      </div>
    </section>
  `;
}

function renderRules(rules) {
  if (!rules.length) {
    return `
      <div class="sub-card">
        <h4>Top triggered rules</h4>
        <p>No major rule-based issues were triggered. The portfolio appears reasonably aligned with the questionnaire inputs.</p>
      </div>
    `;
  }

  return `
    <div class="sub-card">
      <h4>Top triggered rules</h4>
      <div class="rule-list">
        ${rules
          .slice(0, 5)
          .map(
            (rule) => `
              <article class="rule-card">
                <div class="rule-meta">
                  <span class="severity ${SEVERITY_STYLES[rule.severity] || 'severity-medium'}">${rule.severity}</span>
                  <span>${toTitleLabel(rule.theme)} • Priority ${rule.priorityScore}</span>
                </div>
                <h5>${rule.title}</h5>
                <p>${rule.detail}</p>
                <div class="next-step">
                  <strong>How to fix it</strong>
                  <p>${rule.recommendation}</p>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderPositiveSignals(positives) {
  return `
    <section class="sub-card">
      <h4>What you are doing well</h4>
      <ul class="metric-list">
        ${(positives.length ? positives : ['You already have money invested, which is a useful starting point to build from.'])
          .map(
            (item) => `
              <li>
                <span>${item}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    </section>
  `;
}

function renderPortfolioAnalysis(analysis) {
  analysisOutput.classList.remove('hidden');
  analysisOutput.innerHTML = `
    <div class="analysis-stack">
      <div class="sub-card overview-grid">
        <div>
          <h4>Portfolio health</h4>
          <strong class="headline-metric">${analysis.health.score}/100</strong>
          <p class="status-copy">${analysis.health.label}</p>
        </div>
        <div>
          <h4>Total portfolio value</h4>
          <strong class="headline-metric">${formatCurrency(analysis.totalValue)}</strong>
        </div>
        <div>
          <h4>Largest holding</h4>
          <strong class="headline-metric">${analysis.holdings[0]?.symbol || 'N/A'} • ${formatPercent(analysis.holdings[0]?.weight || 0)}</strong>
        </div>
        <div>
          <h4>Top 3 concentration</h4>
          <strong class="headline-metric">${formatPercent(analysis.concentration.topThreeWeight)}</strong>
        </div>
      </div>

      ${renderNarrative(analysis)}
      ${renderThemes(analysis.groupedThemes)}
      ${renderRules(analysis.rules)}
      ${renderPositiveSignals(analysis.positives)}

      <div class="breakdown-grid pie-grid">
        ${renderPieChart(analysis.sectorTotals, 'Sector allocation pie chart')}
        ${renderPieChart(analysis.geographyTotals, 'Geography allocation pie chart')}
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Sector allocation chart</h4>
          ${renderBarChart(analysis.sectorTotals, 'chart-sector')}
        </section>
        <section class="sub-card">
          <h4>Geography allocation chart</h4>
          ${renderBarChart(analysis.geographyTotals, 'chart-geography')}
        </section>
      </div>

      <div class="breakdown-grid">
        <section class="sub-card">
          <h4>Asset class totals</h4>
          ${renderBreakdownList(analysis.assetClassTotals)}
        </section>
        <section class="sub-card">
          <h4>Category totals</h4>
          ${renderBreakdownList(analysis.categoryTotals)}
        </section>
        <section class="sub-card">
          <h4>Geography totals</h4>
          ${renderBreakdownList(analysis.geographyTotals)}
        </section>
        <section class="sub-card">
          <h4>Sector totals</h4>
          ${renderBreakdownList(analysis.sectorTotals)}
        </section>
      </div>

      <section class="sub-card">
        <h4>Per-holding weights</h4>
        <ul class="metric-list">
          ${analysis.holdings
            .map(
              (holding) => `
                <li>
                  <span>${holding.symbol} (${toTitleLabel(holding.metadata.category)} • ${toTitleLabel(holding.primarySector)} • ${holding.metadata.matchLevel})</span>
                  <span>${formatCurrency(holding.amount)} • ${formatPercent(holding.weight)}</span>
                </li>
              `
            )
            .join('')}
        </ul>
      </section>
    </div>
  `;
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  state.login = Object.fromEntries(formData.entries());
  showScreen('questionnaire-screen');
});

questionnaireForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(questionnaireForm);
  state.questionnaire = Object.fromEntries(formData.entries());
  starterOutput.innerHTML = renderStarterPlan(buildStarterPlanSummary(state.questionnaire));
  analysisOutput.classList.add('hidden');
  analysisOutput.innerHTML = '';
  showScreen('choice-screen');
});

document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    if (target === 'starter-screen' && state.questionnaire) {
      starterOutput.innerHTML = renderStarterPlan(buildStarterPlanSummary(state.questionnaire));
    }
    showScreen(target);
  });
});

analysisForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(analysisForm);
  const holdings = parseHoldings(String(formData.get('holdings') || ''));
  const invalidEntries = holdings.filter((holding) => !holding.symbol || Number.isNaN(holding.amount) || holding.amount <= 0);

  if (!holdings.length || invalidEntries.length) {
    analysisOutput.classList.remove('hidden');
    analysisOutput.innerHTML = `
      <strong>Please check your format.</strong>
      <p>Use one holding per line in the format <em>TICKER — 5000</em>, and for cash, just write format of <em>CASH — 5000</em>.</p>
    `;
    return;
  }

  const analysis = analyzePortfolio(holdings, state.questionnaire);
  savePortfolio(analysis);
  renderPortfolioAnalysis(analysis);
});

window.parseHoldings = parseHoldings;
window.analyzePortfolio = analyzePortfolio;
window.resolveSecurity = resolveSecurity;
window.getSecurityMetadataTable = getSecurityMetadataTable;
