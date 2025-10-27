const Address = require('../Models/Address');

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isDefault } = req.body;

    let address 
    
    const AllAddress = await Address.find({user: userId})
    console.log('AllAddress', AllAddress)
    if(AllAddress.length===0){
      address = await Address.create({ ...req.body, isDefault: true, user: userId });
    }else{
      address = await Address.create({ ...req.body, user: userId });
    }

    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ user: userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (req.body.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Address not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deleted = await Address.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Address not found' });

    

    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
