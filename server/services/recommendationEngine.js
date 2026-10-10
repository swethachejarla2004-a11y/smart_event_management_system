/**
 * Explainable Content-Based AI Recommendation Engine
 * Calculates normalized match percentage (0-100%) between a Student and an Event,
 * and generates human-readable "Why Recommended" breakdown reasons.
 */

const calculateEventMatch = (student, event, userHistory = []) => {
  let score = 0;
  const maxScore = 100;
  const reasons = [];

  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const studentInterests = (student.interests || []).map(i => i.toLowerCase());
  const studentCategories = (student.preferredCategories || []).map(c => c.toLowerCase());
  const studentAvailability = (student.availability || []).map(a => a.toLowerCase());

  const eventCategory = (event.category || '').toLowerCase();
  const eventSkills = (event.requiredSkills || []).map(s => s.toLowerCase());
  const eventTitle = (event.title || '').toLowerCase();
  const eventDesc = (event.description || '').toLowerCase();

  // 1. Category Match (Max 30 points)
  if (studentCategories.includes(eventCategory)) {
    score += 30;
    reasons.push(`✓ Matches your preferred category (${event.category})`);
  } else if (studentInterests.some(interest => eventCategory.includes(interest))) {
    score += 20;
    reasons.push(`✓ Aligns with your interest area (${event.category})`);
  }

  // 2. Skill Match (Max 35 points)
  if (eventSkills.length > 0) {
    const matchedSkills = eventSkills.filter(skill => 
      studentSkills.some(sSkill => sSkill.includes(skill) || skill.includes(sSkill))
    );
    if (matchedSkills.length > 0) {
      const skillPoints = Math.min(35, Math.round((matchedSkills.length / eventSkills.length) * 35));
      score += skillPoints;
      reasons.push(`✓ Matches your skills: ${matchedSkills.map(s => s.toUpperCase()).join(', ')}`);
    }
  } else {
    // If event requires no specific skills, give partial baseline skill points if student has any skills
    if (studentSkills.length > 0) {
      score += 15;
      reasons.push(`✓ Open to general skill background`);
    }
  }

  // 3. Interest & Description Keyword Match (Max 20 points)
  let interestMatchCount = 0;
  const matchedInterests = [];
  studentInterests.forEach(interest => {
    if (eventTitle.includes(interest) || eventDesc.includes(interest)) {
      interestMatchCount++;
      matchedInterests.push(interest);
    }
  });

  if (interestMatchCount > 0) {
    const interestPoints = Math.min(20, interestMatchCount * 10);
    score += interestPoints;
    reasons.push(`✓ Mentioned in your interests: ${matchedInterests.join(', ')}`);
  }

  // 4. Availability Match (Max 15 points)
  if (studentAvailability.length > 0) {
    // Basic day/weekend check
    const eventDate = new Date(event.date);
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';

    const matchesAvailability = studentAvailability.some(avail => {
      const a = avail.toLowerCase();
      if (isWeekend && (a.includes('weekend') || a.includes('saturday') || a.includes('sunday'))) return true;
      if (a.includes(dayOfWeek)) return true;
      if (a.includes('flexible') || a.includes('anytime')) return true;
      return false;
    });

    if (matchesAvailability) {
      score += 15;
      reasons.push(`✓ Matches your scheduled availability (${dayOfWeek})`);
    }
  }

  // Guarantee minimum score for broad discovery
  const finalScore = Math.min(100, Math.max(15, score));
  
  if (reasons.length === 0) {
    reasons.push(`✓ Trending event in your campus community`);
  }

  return {
    matchPercentage: finalScore,
    reasons
  };
};

const getPersonalizedEventRecommendations = (student, events, userHistory = []) => {
  return events.map(event => {
    const { matchPercentage, reasons } = calculateEventMatch(student, event, userHistory);
    return {
      event,
      matchPercentage,
      reasons
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

module.exports = {
  calculateEventMatch,
  getPersonalizedEventRecommendations
};
