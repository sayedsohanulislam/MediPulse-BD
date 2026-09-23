const Medicine = require('../models/Medicine');
const { getStore, getIsConnected } = require('../config/db');
const { medicinesSeed } = require('../services/mockDataService');

const store = getStore();
if (store.medicines.length === 0) {
  store.medicines = JSON.parse(JSON.stringify(medicinesSeed));
}

exports.searchMedicines = async (req, res) => {
  try {
    const { search, category } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (search) {
        query.$or = [
          { brandName: new RegExp(search, 'i') },
          { genericName: new RegExp(search, 'i') }
        ];
      }
      if (category && category !== 'All') {
        query.therapeuticClass = new RegExp(category, 'i');
      }
      const meds = await Medicine.find(query);
      return res.json({ success: true, count: meds.length, data: meds });
    } else {
      let results = [...store.medicines];
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(m => 
          m.brandName.toLowerCase().includes(s) || 
          m.genericName.toLowerCase().includes(s)
        );
      }
      if (category && category !== 'All') {
        results = results.filter(m => m.therapeuticClass.toLowerCase().includes(category.toLowerCase()));
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBannedAndRecalled = async (req, res) => {
  try {
    if (getIsConnected()) {
      const recalled = await Medicine.find({ isBannedOrRecalled: true });
      return res.json({ success: true, count: recalled.length, data: recalled });
    } else {
      const recalled = store.medicines.filter(m => m.isBannedOrRecalled);
      return res.json({ success: true, count: recalled.length, data: recalled });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.calculateGenericSavings = (req, res) => {
  const { currentBrandPrice, genericPrice, monthlyTablets } = req.body;
  const current = Number(currentBrandPrice) || 0;
  const generic = Number(genericPrice) || 0;
  const qty = Number(monthlyTablets) || 30;

  const currentMonthlyExpense = +(current * qty).toFixed(2);
  const genericMonthlyExpense = +(generic * qty).toFixed(2);
  const monthlySavings = +(currentMonthlyExpense - genericMonthlyExpense).toFixed(2);
  const yearlySavings = +(monthlySavings * 12).toFixed(2);
  const percentageSavings = currentMonthlyExpense > 0 
    ? Math.round((monthlySavings / currentMonthlyExpense) * 100) 
    : 0;

  return res.json({
    success: true,
    data: {
      currentMonthlyExpense,
      genericMonthlyExpense,
      monthlySavings: Math.max(0, monthlySavings),
      yearlySavings: Math.max(0, yearlySavings),
      percentageSavings: Math.max(0, percentageSavings)
    }
  });
};
