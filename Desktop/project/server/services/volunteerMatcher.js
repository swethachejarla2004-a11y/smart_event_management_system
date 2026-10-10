/**
 * Volunteer Task Matching Engine
 * Recommends optimal volunteer tasks to students based on skill alignment,
 * availability, and experience.
 */

const matchVolunteerToTasks = (student, event) => {
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const studentAvailability = (student.availability || []).map(a => a.toLowerCase());
  const tasks = event.volunteerTasks || [];

  if (!tasks.length) {
    // Default general volunteer task fallback
    return [{
      taskTitle: 'General Event Support',
      matchScore: 80,
      reasons: ['✓ Great entry opportunity for campus volunteers']
    }];
  }

  return tasks.map(task => {
    let score = 30; // Base score
    const reasons = [];

    const taskSkills = (task.requiredSkills || []).map(s => s.toLowerCase());
    const taskTitle = (task.title || '').toLowerCase();

    // Skill Match
    const matchedSkills = taskSkills.filter(ts => 
      studentSkills.some(ss => ss.includes(ts) || ts.includes(ss))
    );

    if (matchedSkills.length > 0) {
      score += 45;
      reasons.push(`✓ Has required task skills: ${matchedSkills.map(s => s.toUpperCase()).join(', ')}`);
    } else {
      // Check title keywords vs student skills
      const titleMatched = studentSkills.filter(ss => taskTitle.includes(ss));
      if (titleMatched.length > 0) {
        score += 30;
        reasons.push(`✓ Skill background matches task role (${titleMatched.join(', ')})`);
      }
    }

    // Availability Check
    if (studentAvailability.length > 0) {
      score += 25;
      reasons.push(`✓ Available for assigned schedule`);
    }

    const finalScore = Math.min(100, Math.max(20, score));

    return {
      taskId: task._id,
      taskTitle: task.title,
      description: task.description,
      matchScore: finalScore,
      reasons
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = {
  matchVolunteerToTasks
};
