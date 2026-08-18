const User = require('../models/User');

// @route   GET /api/search
exports.searchProfiles = async (req, res) => {
  try {
    const {
      gender,
      ageMin,
      ageMax,
      district,
      religion,
      caste,
      education,
      occupation,
      income,
      maritalStatus,
      premiumOnly,
      verifiedOnly,
      keyword,
      page = 1,
      limit = 12
    } = req.query;

    const requestingUser = req.user;
    const isGuest = !requestingUser;

    // Public search strictly requires role: 'user', status: 'active', and Admin verification (profileVerified: true)
    const query = {
      role: 'user',
      status: { $ne: 'inactive' },
      profileVerified: true
    };

    // User Membership Tier Filtering:
    // - Guest: limit 3 profiles preview
    // - Free User: can view ALL profiles in the Free membership category (no 3-profile limit!)
    // - Classic & Premium Users: unrestricted access to ALL profiles
    if (!isGuest) {
      const userTier = (requestingUser.membership || requestingUser.membershipPlan || 'Free').toLowerCase();
      if (userTier === 'free') {
        query.$and = [
          {
            $or: [
              { membership: 'free' },
              { membershipPlan: 'Free' },
              { premiumMember: false }
            ]
          }
        ];
      }
    }

    // Gender filter
    if (gender) {
      if (gender === 'Bride' || gender === 'Female') {
        query.gender = { $in: ['Bride', 'Female'] };
      } else if (gender === 'Groom' || gender === 'Male') {
        query.gender = { $in: ['Groom', 'Male'] };
      } else {
        query.gender = gender;
      }
    }

    // Age range filter
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }

    // District filter (case insensitive match for TN districts)
    if (district && district !== 'All Districts') {
      query.district = new RegExp(district, 'i');
    }

    // Religion
    if (religion && religion !== 'All Relgions' && religion !== 'Any') {
      query.religion = new RegExp(religion, 'i');
    }

    // Caste
    if (caste && caste !== 'All Castes' && caste !== 'Any') {
      query.caste = new RegExp(caste, 'i');
    }

    // Education
    if (education && education !== 'Any') {
      query.education = new RegExp(education, 'i');
    }

    // Occupation
    if (occupation && occupation !== 'Any') {
      query.occupation = new RegExp(occupation, 'i');
    }

    // Marital Status
    if (maritalStatus && maritalStatus !== 'Any') {
      query.maritalStatus = maritalStatus;
    }

    // Income
    if (income && income !== 'Any') {
      query.income = new RegExp(income, 'i');
    }

    // Verification and Premium flags
    if (verifiedOnly === 'true') {
      query.profileVerified = true;
    }

    if (premiumOnly === 'true') {
      query.premiumMember = true;
    }

    // Free text keyword search
    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      const keywordCondition = {
        $or: [
          { name: regex },
          { profileId: regex },
          { occupation: regex },
          { district: regex },
          { caste: regex }
        ]
      };
      if (query.$and) {
        query.$and.push(keywordCondition);
      } else {
        query.$and = [keywordCondition];
      }
    }

    const fetchLimit = isGuest ? 3 : Number(limit);
    const skip = isGuest ? 0 : (Number(page) - 1) * fetchLimit;

    const profiles = await User.find(query)
      .select('-password')
      .sort({ premiumMember: -1, createdAt: -1 })
      .skip(skip)
      .limit(fetchLimit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: profiles.length,
      total: isGuest ? Math.min(total, 3) : total,
      page: isGuest ? 1 : Number(page),
      pages: isGuest ? 1 : Math.ceil(total / fetchLimit),
      isGuest,
      profiles
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Server error while searching profiles' });
  }
};
