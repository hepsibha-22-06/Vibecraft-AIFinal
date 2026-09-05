// Basic automated test suite for VibeCraft AI backend services
import { fallbackService } from '../services/fallbackService.js';
import { aiService } from '../services/aiService.js';

async function runTests() {
  console.log('--- RUNNING BACKEND TESTS ---');
  let failures = 0;

  // Test 1: Fallback service returns activities
  try {
    const activities = fallbackService.getActivities({
      team_size: '6-10',
      setting: 'Remote',
      vibe: 'Casual',
      activity_type: 'Icebreaker',
      limit: 4
    });
    if (activities.length === 4 && activities[0].title) {
      console.log('✅ Test 1: Fallback getActivities passed (returned 4 activities)');
    } else {
      throw new Error(`Expected 4 activities, got ${activities.length}`);
    }
  } catch (err) {
    console.error('❌ Test 1 failed:', err.message);
    failures++;
  }

  // Test 2: Surprise Me returns 1 activity
  try {
    const surprise = fallbackService.getSurpriseActivity();
    if (surprise && surprise.title && surprise.instructions) {
      console.log(`✅ Test 2: Surprise Me passed ("${surprise.title}")`);
    } else {
      throw new Error('Invalid surprise activity');
    }
  } catch (err) {
    console.error('❌ Test 2 failed:', err.message);
    failures++;
  }

  // Test 3: Regenerate with exclusion logic
  try {
    const original = fallbackService.getActivities({ limit: 1 })[0];
    const regenerated = fallbackService.regenerateActivity({
      exclude_titles: [original.title]
    });
    if (regenerated && regenerated.title !== original.title) {
      console.log(`✅ Test 3: Regenerate exclusion passed ("${regenerated.title}" !== "${original.title}")`);
    } else {
      throw new Error('Regenerate returned the excluded title');
    }
  } catch (err) {
    console.error('❌ Test 3 failed:', err.message);
    failures++;
  }

  // Test 4: Trivia questions
  try {
    const trivia = fallbackService.getTriviaQuestions({ count: 3 });
    if (trivia.length === 3 && trivia[0].options.length === 4) {
      console.log('✅ Test 4: Trivia questions passed');
    } else {
      throw new Error('Trivia questions format incorrect');
    }
  } catch (err) {
    console.error('❌ Test 4 failed:', err.message);
    failures++;
  }

  // Test 5: AIService graceful generation
  try {
    const result = await aiService.generateActivities({
      team_size: '6-10',
      setting: 'Hybrid',
      vibe: 'Creative',
      activity_type: 'Icebreaker'
    });
    if (result.activities && result.activities.length > 0) {
      console.log(`✅ Test 5: AIService generateActivities passed (Source: ${result.source}, count: ${result.activities.length})`);
    } else {
      throw new Error('AIService returned empty activities array');
    }
  } catch (err) {
    console.error('❌ Test 5 failed:', err.message);
    failures++;
  }

  console.log('---------------------------------');
  if (failures === 0) {
    console.log('🎉 ALL BACKEND SERVICE TESTS PASSED!');
    process.exit(0);
  } else {
    console.error(`⚠️ ${failures} tests failed!`);
    process.exit(1);
  }
}

runTests();
