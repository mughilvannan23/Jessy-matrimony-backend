const SuccessStory = require('../models/SuccessStory');
const ContactQuery = require('../models/ContactQuery');

// @route   GET /api/success-stories
exports.getSuccessStories = async (req, res) => {
  try {
    let stories = await SuccessStory.find().sort({ createdAt: -1 });

    if (stories.length === 0) {
      stories = [
        {
          _id: 's1',
          brideName: 'Kavitha S.',
          groomName: 'Karthik Raja',
          district: 'Trichy',
          story: 'We met through Jessy Matrimony in Trichy. Our families connected instantly due to transparent horoscope and background details. We got happily married in January 2026!',
          photos: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'],
          weddingDate: 'Jan 2026'
        },
        {
          _id: 's2',
          brideName: 'Divya M.',
          groomName: 'Senthil Kumar',
          district: 'Coimbatore',
          story: 'Finding a Kongu Vellalar groom in Kovai was so smooth on Jessy Matrimony. Filter by district helped us narrow down verified profiles within days.',
          photos: ['https://images.unsplash.com/photo-1609151162377-794faf68b02f?auto=format&fit=crop&w=600&q=80'],
          weddingDate: 'Feb 2026'
        },
        {
          _id: 's3',
          brideName: 'Priya Dharshini',
          groomName: 'Vigneshwaran R.',
          district: 'Madurai',
          story: 'Special thanks to Jessy Matrimony premium membership service. Our relationship manager assisted us throughout the matchmaking process.',
          photos: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'],
          weddingDate: 'Mar 2026'
        }
      ];
    }

    res.json({ success: true, count: stories.length, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching success stories' });
  }
};

// @route   POST /api/success-stories
exports.createSuccessStory = async (req, res) => {
  try {
    const { brideName, groomName, district, story, photos, weddingDate } = req.body;
    const newStory = await SuccessStory.create({
      brideName,
      groomName,
      district,
      story,
      photos: photos || ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'],
      weddingDate
    });

    res.status(201).json({ success: true, message: 'Success story published successfully!', story: newStory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating success story' });
  }
};

// @route   POST /api/contact
exports.submitContactQuery = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;
    const query = await ContactQuery.create({ name, email, mobile, subject, message });
    res.status(201).json({ success: true, message: 'Thank you for contacting Jessy Matrimony. Our team will get back to you shortly!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting contact query' });
  }
};
