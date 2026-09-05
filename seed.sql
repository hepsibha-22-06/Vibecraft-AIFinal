-- ==========================================================
-- VIBECRAFT AI - SUPABASE SEED DATA
-- 40 Curated Production Activities (Remote, In-person, Hybrid, All Vibes)
-- ==========================================================

INSERT INTO public.activities (
    id, title, description, activity_type, duration_minutes,
    team_size_min, team_size_max, setting, vibe, difficulty,
    instructions, materials, why_it_works, ai_generated
) VALUES
(
    '11111111-1111-4111-8111-111111111101',
    'Desert Island Desk Edition',
    'Team members pick one object currently within arm''s reach and pitch why it is the ultimate survival tool.',
    'Icebreaker', 10, 3, 20, 'Remote', 'Casual', 'Easy',
    '["Ask everyone to scan their desk and pick one non-tech object within arm''s reach.", "Give each participant 45 seconds to pitch how this mundane object will guarantee survival on a deserted island.", "Team votes in chat or with emoji reactions on the most inventive pitch."]'::jsonb,
    '["One physical object from desk", "Video conference chat"]'::jsonb,
    'Low pressure, sparks creative storytelling from everyday items, and offers a fun glimpse into each colleague''s personal workspace.',
    false
),
(
    '11111111-1111-4111-8111-111111111102',
    'Executive Time Capsule',
    'Team collaboratively forecasts 3 company, industry, or culture milestones that will happen exactly 1 year from today.',
    'Team Building', 15, 5, 25, 'Hybrid', 'Professional', 'Medium',
    '["Open a shared virtual doc or whiteboard labeled ''One Year Ahead''.", "Break the team into pairs to write one bold industry prediction, one team win, and one wild cultural wildcard.", "Reconvene to vote on the top 3 and commit them to an official team calendar reminder 12 months out."]'::jsonb,
    '["Shared document or virtual whiteboard"]'::jsonb,
    'Aligns strategic thinking, prompts optimistic long-term vision, and creates a recurring shared memory ritual.',
    false
),
(
    '11111111-1111-4111-8111-111111111103',
    'Lightning Emoji Riddle Relay',
    'Fast-paced guessing game where teammates decrypt pop culture, movies, or company acronyms written strictly in emoji strings.',
    'Quick Game', 5, 4, 50, 'Remote', 'Energetic', 'Easy',
    '["Host posts an emoji sequence into the group chat representing a famous movie or team milestone.", "First person to type the correct title wins the round and earns the right to post the next riddle.", "Play 5 rapid rounds back-to-back."]'::jsonb,
    '["Team chat channel or meeting chat"]'::jsonb,
    'Instant energy injection that breaks meeting fatigue with zero preparation needed.',
    false
),
(
    '11111111-1111-4111-8111-111111111104',
    'The Rose, Thorn & Spaghetti',
    'A playful twist on the classic check-in: share one highlight (rose), one obstacle (thorn), and one absurd or unexpected surprise (spaghetti).',
    'Conversation Starter', 10, 2, 12, 'All', 'Relaxed', 'Easy',
    '["Go around the circle or call sheet.", "Each person shares in 60 seconds: their Rose (something great this week), Thorn (something challenging), and Spaghetti (something weird or messy that happened).", "No interruptions, only thumbs up or heartfelt reactions."]'::jsonb,
    '["None required"]'::jsonb,
    'Fosters psychological safety and vulnerability without feeling heavy or clinical.',
    false
),
(
    '11111111-1111-4111-8111-111111111105',
    'The Shark Tank Pitch: Terrible Inventions',
    'Small breakout teams formulate a convincing, serious startup pitch for intentionally flawed or useless inventions.',
    'Team Building', 20, 6, 30, 'Hybrid', 'Creative', 'Medium',
    '["Assign each breakout group a bizarre product concept (e.g. Solar-powered flashlight, waterproof teabag).", "Give teams 7 minutes to draft a 90-second investor pitch detailing target audience, pricing, and key value propositions.", "Teams pitch to the remaining participants who act as the ''Venture Board'' and rate pitches on humor and persuasion."]'::jsonb,
    '["Breakout rooms or whiteboard"]'::jsonb,
    'Demolishes fear of failure while stretching improvisational and collaborative pitching chops.',
    false
),
(
    '11111111-1111-4111-8111-111111111106',
    'Pop Culture & Tech Decades Trivia',
    'Rapid-fire 5-question trivia challenge testing knowledge on tech breakthroughs, 90s nostalgia, and world wonders.',
    'Trivia', 10, 4, 50, 'All', 'Energetic', 'Medium',
    '["Host presents one question at a time with 4 choices.", "Teammates submit answers via poll, private message, or show of hands.", "Host reveals the historical context behind the answer and updates the live leaderboard."]'::jsonb,
    '["Screen share or quiz display"]'::jsonb,
    'Creates friendly competition and taps into varied personal backgrounds and interests.',
    false
),
(
    '11111111-1111-4111-8111-111111111107',
    'The 2-Minute Life Map',
    'Each participant draws 3 key geographic coordinates or pivotal moments that shaped who they are today.',
    'Icebreaker', 15, 3, 15, 'In-person', 'Relaxed', 'Easy',
    '["Hand out index cards and sharpies (or open a digital canvas).", "Set a timer for 2 minutes: draw a simple line with 3 stops representing pivotal crossroads in your life or career.", "Pair up or present in 1 minute each."]'::jsonb,
    '["Paper and markers or digital whiteboard"]'::jsonb,
    'Humanizes colleagues beyond their job titles by honoring their personal journeys.',
    false
),
(
    '11111111-1111-4111-8111-111111111108',
    'Silent Alignment Matrix',
    'A collaborative silent brainstorming exercise where team members silently cluster strategic priorities without speaking.',
    'Team Building', 15, 5, 20, 'In-person', 'Professional', 'Hard',
    '["Write 15 current initiatives or ideas on sticky notes on a wall.", "For 5 minutes, nobody is allowed to speak: participants move notes into ''High Impact / Low Effort'' quadrants.", "If someone disagrees with a placement, they can move it once. Open the floor afterward to debrief consensus."]'::jsonb,
    '["Sticky notes and wall or Miro board"]'::jsonb,
    'Eliminates loud-voice bias and lets introverted thinkers contribute equally to group alignment.',
    false
),
(
    '11111111-1111-4111-8111-111111111109',
    'Two Truths & A Dream Job',
    'Participants share two verifiable true facts about their background and one childhood dream profession.',
    'Icebreaker', 10, 4, 18, 'All', 'Casual', 'Easy',
    '["Each person announces 3 statements: two unusual things they have actually done, and one dream job they wanted when they were 7 years old.", "The rest of the team guesses which statement is the childhood dream.", "The person reveals the story behind the truth."]'::jsonb,
    '["None"]'::jsonb,
    'Uncovers surprising passions and skills your colleagues possess that never appear on their LinkedIn profiles.',
    false
),
(
    '11111111-1111-4111-8111-111111111110',
    'Speed Networking Matrix',
    'Fast 3-minute 1-on-1 breakout conversations with prompt cards that rotate 3 times.',
    'Conversation Starter', 12, 6, 40, 'Remote', 'Casual', 'Easy',
    '["Host announces the prompt: ''What is a piece of advice you received that completely changed your mind?''", "Launch 3-minute 1-on-1 breakout rooms.", "Bring everyone back, assign a fresh prompt, and scramble pairs."]'::jsonb,
    '["Breakout rooms feature"]'::jsonb,
    'Provides deep individual connection without awkward group hesitation.',
    false
),
(
    '11111111-1111-4111-8111-111111111111',
    'Common Ground Scavenger',
    'In small groups, find 3 hyper-specific, unexpected things all members have in common within 5 minutes.',
    'Team Building', 10, 4, 24, 'Hybrid', 'Casual', 'Medium',
    '["Groups of 3 to 4 are formed.", "Rule: Common ground cannot be work-related or basic geography.", "Groups present their weirdest shared trait."]'::jsonb,
    '["Note pad or chat"]'::jsonb,
    'Builds instant affinity bonds and interpersonal empathy across diverse backgrounds.',
    false
),
(
    '11111111-1111-4111-8111-111111111112',
    'The 6-Word Memoir Challenge',
    'Craft a concise six-word summary describing your current week, superpower, or work philosophy.',
    'Conversation Starter', 8, 3, 25, 'All', 'Creative', 'Easy',
    '["Give everyone 90 seconds of silence to write a 6-word phrase about their week.", "Post all memoirs in the chat simultaneously on the count of three.", "Host highlights standout submissions."]'::jsonb,
    '["Chat box or post-its"]'::jsonb,
    'Extreme brevity forces clarity, wit, and vulnerability without lengthy monologues.',
    false
),
(
    '11111111-1111-4111-8111-111111111113',
    'Blind Drawing Protocol',
    'One person describes an abstract geometrical icon or object using only spatial instructions; teammate sketches it accurately.',
    'Team Building', 15, 4, 20, 'Hybrid', 'Energetic', 'Medium',
    '["Pair up: Architect vs Drafter.", "Architect guides Drafter using only coordinate spatial instructions.", "Compare final sketch with original."]'::jsonb,
    '["Pen and paper or digital drawing canvas"]'::jsonb,
    'Hilariously reveals communication bottlenecks and teaches precision in delegation.',
    false
),
(
    '11111111-1111-4111-8111-111111111114',
    'Album Cover of the Week',
    'If your team''s past sprint or quarter was a music album, what would the cover art and title track be?',
    'Icebreaker', 10, 4, 16, 'Remote', 'Creative', 'Easy',
    '["In 3 minutes, each sub-team names the Album Title, Musical Genre, and 2 track titles.", "Share and discuss which track would top the charts."]'::jsonb,
    '["Slide or chat"]'::jsonb,
    'Transforms retrospective reflections into lighthearted, humorous metaphors that relieve stress.',
    false
),
(
    '11111111-1111-4111-8111-111111111115',
    'High-Stakes Trivia Duel',
    'Multi-category trivia where correct answers let you allocate bonus points or trivia curses to rival squads.',
    'Trivia', 15, 6, 40, 'All', 'Energetic', 'Medium',
    '["Form 2 to 4 squads.", "Host asks questions from science, cinema, history, and internet culture.", "Squads compete for points and trivia power-ups."]'::jsonb,
    '["Scoreboard or VibeCraft Trivia Mode"]'::jsonb,
    'Unleashes high-energy camaraderie and friendly team banter.',
    false
),
(
    '11111111-1111-4111-8111-111111111116',
    'The User Manual To Me',
    'Share your top productivity superpower, preferred feedback style, and pet peeve in 90 seconds.',
    'Conversation Starter', 15, 3, 12, 'All', 'Professional', 'Medium',
    '["Fill out 3 prompts: best time to ping, feedback preference, recharge habits.", "Each person presents their User Manual.", "Archive in team wiki for ongoing onboarding."]'::jsonb,
    '["User manual template or shared doc"]'::jsonb,
    'Radically reduces workplace friction, misunderstanding, and communication mismatches.',
    false
),
(
    '11111111-1111-4111-8111-111111111117',
    'Virtual Desk Safari',
    'A fast-paced interactive hunt to show the oldest gadget or most quirky souvenir currently in your space.',
    'Quick Game', 7, 4, 30, 'Remote', 'Casual', 'Easy',
    '["Count down from 60 seconds: find the most ancient tech gadget or strange souvenir.", "Hold up items to camera.", "Select 3 items for rapid backstories."]'::jsonb,
    '["Webcam and home workspace"]'::jsonb,
    'Gets people moving physically, breaks screen stagnation, and sparks joyful discovery.',
    false
),
(
    '11111111-1111-4111-8111-111111111118',
    'The Compliment Web',
    'A structured gratitude ritual where colleagues pass authentic praise and recognition to one another.',
    'Team Building', 12, 5, 20, 'All', 'Relaxed', 'Easy',
    '["First person recognizes a specific contribution of another teammate.", "Recipient accepts and passes a compliment to the next person.", "Continue until every member is spotlighted."]'::jsonb,
    '["None"]'::jsonb,
    'Significantly boosts morale, strengthens social cohesion, and validates individual contribution.',
    false
),
(
    '11111111-1111-4111-8111-111111111119',
    'Crisis Communications Lab',
    'Team brainstorms a crisis press release for a bizarre fictional product malfunction in 8 minutes.',
    'Team Building', 20, 6, 24, 'Hybrid', 'Professional', 'Hard',
    '["Present fictional PR disaster.", "Subgroups draft a 3-bullet public response.", "Vote on best balance of transparency and poise."]'::jsonb,
    '["Collaborative document"]'::jsonb,
    'Strengthens quick strategic decision making and cross-departmental problem solving under simulated pressure.',
    false
),
(
    '11111111-1111-4111-8111-111111111120',
    'The GIF React Grand Prix',
    'React to hilarious workplace and daily life scenarios solely with the most fitting animated GIF.',
    'Quick Game', 6, 4, 50, 'Remote', 'Energetic', 'Easy',
    '["Announce hilarious prompt.", "45 seconds to drop a GIF in chat.", "Vote with emoji reactions to crown winner."]'::jsonb,
    '["Chat with GIF picker"]'::jsonb,
    'Fast, zero-stress fun that lets humor shine through without demanding public speaking.',
    false
),
(
    '11111111-1111-4111-8111-111111111121',
    'The Unpopular Opinion Arena',
    'Politely defend a harmless, low-stakes hot take that goes against conventional wisdom.',
    'Conversation Starter', 10, 3, 15, 'All', 'Casual', 'Easy',
    '["Harmless hot takes only (food, films, daily quirks).", "Defend your take in 60 seconds.", "Audience offers lively, friendly counterpoints."]'::jsonb,
    '["None"]'::jsonb,
    'Encourages playful debate and shows that disagreement can be respectful, lively, and entertaining.',
    false
),
(
    '11111111-1111-4111-8111-111111111122',
    'The Marshmallow & Spaghetti Skyscraper',
    'Classic hands-on engineering challenge to build the tallest freestanding structure with spaghetti and marshmallows.',
    'Team Building', 20, 6, 30, 'In-person', 'Creative', 'Medium',
    '["Provide spaghetti, tape, string, and marshmallow.", "18 minutes to construct highest freestanding tower.", "Measure heights and reflect on rapid prototyping."]'::jsonb,
    '["Spaghetti, tape, string, marshmallows"]'::jsonb,
    'Demonstrates that rapid iterative prototyping beats over-analyzing and builds tactile teamwork.',
    false
),
(
    '11111111-1111-4111-8111-111111111123',
    'Soundtrack of My Life',
    'Share the one walk-up song that would play whenever you walk into an important meeting or sports arena.',
    'Icebreaker', 8, 3, 20, 'All', 'Energetic', 'Easy',
    '["Pick personal walk-up anthem.", "Play 15-second snippet.", "Explain mindset and backstory behind song."]'::jsonb,
    '["Audio player or snippet link"]'::jsonb,
    'Music triggers emotional resonance and personal memories that transcend professional formalities.',
    false
),
(
    '11111111-1111-4111-8111-111111111124',
    'One Word Pulse Check',
    'An ultra-fast 3-minute emotional barometer reading across the whole team before launching into deep work.',
    'Conversation Starter', 5, 2, 50, 'All', 'Relaxed', 'Easy',
    '["Pause and reflect.", "Each member shares exactly one adjective describing their current focus.", "Facilitator acknowledges baseline."]'::jsonb,
    '["None"]'::jsonb,
    'Provides instantaneous empathy and awareness of team bandwidth without consuming meeting time.',
    false
),
(
    '11111111-1111-4111-8111-111111111125',
    'The Ultimate Pitch Deck in 3 Slides',
    'Create a 3-slide pitch for a hypothetical team offsite or innovation project using bizarre stock images.',
    'Team Building', 20, 6, 24, 'Remote', 'Creative', 'Medium',
    '["Provide 3 random absurd stock photos.", "Draft 3-slide story in 10 minutes.", "Present in 2 minutes."]'::jsonb,
    '["Google Slides or PowerPoint"]'::jsonb,
    'Hones narrative cohesion, synthesis, and creative storytelling under constraint.',
    false
),
(
    '11111111-1111-4111-8111-111111111126',
    'Rapid Fact or Fiction',
    'Participants guess whether mind-boggling statements about nature, science, and history are real or elaborate hoaxes.',
    'Trivia', 10, 4, 50, 'All', 'Casual', 'Medium',
    '["Host reads mind-bending fact.", "Teammates vote Fact or Fiction.", "Host debriefs real backstory."]'::jsonb,
    '["Trivia cards or screen"]'::jsonb,
    'Sparks intellectual curiosity and playful disbelief that bonds the room.',
    false
),
(
    '11111111-1111-4111-8111-111111111127',
    'Picture Scavenger: The Memory Tile',
    'Share the most recent photo on your camera roll that made you smile and its story.',
    'Icebreaker', 10, 3, 15, 'Hybrid', 'Casual', 'Easy',
    '["Select a joyful photo from past month.", "Show to team.", "Give 45-second backstory."]'::jsonb,
    '["Phone photo gallery"]'::jsonb,
    'Grounds conversations in real human moments outside of work responsibilities.',
    false
),
(
    '11111111-1111-4111-8111-111111111128',
    'The Reverse Brainstorming Gauntlet',
    'Instead of solving a problem, teams brainstorm how to make the problem 1000% worse, then reverse the insights.',
    'Team Building', 18, 4, 20, 'All', 'Professional', 'Medium',
    '["Select a challenge.", "Spend 5 minutes listing worst possible moves.", "Reverse into breakthrough positive safeguards."]'::jsonb,
    '["Whiteboard or Miro"]'::jsonb,
    'Bypasses polite team self-censorship and uncovers hidden risks through constructive humor.',
    false
),
(
    '11111111-1111-4111-8111-111111111129',
    'Speed Pictionary Battle',
    'One team member sketches a secret prompt on an interactive digital canvas while teammates scramble to guess it in 45 seconds.',
    'Quick Game', 10, 4, 30, 'Remote', 'Energetic', 'Easy',
    '["Host messages secret concept to sketcher.", "45 seconds to sketch without letters.", "Teammates guess in chat."]'::jsonb,
    '["Digital whiteboard"]'::jsonb,
    'Equalizes drawing skills with frantic energy and infectious laughter.',
    false
),
(
    '11111111-1111-4111-8111-111111111130',
    'The Time Traveler''s Warning',
    'If you could send a 10-second voice message back to your younger self on your first day of work, what would you say?',
    'Conversation Starter', 12, 3, 14, 'All', 'Relaxed', 'Easy',
    '["Reflect on first career steps.", "Share one reassuring or witty message.", "Debrief shared growth."]'::jsonb,
    '["None"]'::jsonb,
    'Generates profound mentorship insights and deep mutual respect across seniority levels.',
    false
),
(
    '11111111-1111-4111-8111-111111111131',
    'The Team Superpower Swap',
    'Teammates identify and trade complementary skills or knowledge they would love to learn from one another.',
    'Team Building', 15, 4, 20, 'Hybrid', 'Professional', 'Medium',
    '["Write 1 superpower you offer and 1 skill you seek.", "Pair into peer coffee chat buddies."]'::jsonb,
    '["Shared doc or notes"]'::jsonb,
    'Breaks cross-disciplinary silos and sparks ongoing peer-to-peer mentoring.',
    false
),
(
    '11111111-1111-4111-8111-111111111132',
    'The Human Knot Unraveled',
    'Classic physical team coordination challenge where members grab hands in a tangled circle and untangle without letting go.',
    'Team Building', 15, 6, 16, 'In-person', 'Energetic', 'Medium',
    '["Stand in circle and grasp opposing hands.", "Untangle into an open circle without letting go.", "Discuss leadership and spatial coordination."]'::jsonb,
    '["Open floor space"]'::jsonb,
    'Demands active somatic cooperation, spatial communication, and shared physical focus.',
    false
),
(
    '11111111-1111-4111-8111-111111111133',
    'Trivia Smackdown: Word Origins & Slang',
    'Guess the surprising historical origin of everyday idioms like bite the bullet or spill the beans.',
    'Trivia', 10, 4, 40, 'All', 'Casual', 'Medium',
    '["Host shares idiom with 3 possible origins.", "Teams guess genuine origin.", "Reveal true etymology."]'::jsonb,
    '["Screen share or trivia prompt"]'::jsonb,
    'Engages language enthusiasts and curious minds across all cultures.',
    false
),
(
    '11111111-1111-4111-8111-111111111134',
    'The Future Headline',
    'Write the front-page TechCrunch or Wall Street Journal headline announcing your team''s biggest triumph 3 years from now.',
    'Icebreaker', 12, 4, 20, 'All', 'Professional', 'Easy',
    '["2 minutes to craft bold 3-year headline and subdeck.", "Read aloud with anchor cadence.", "Synthesize collective aspirations."]'::jsonb,
    '["Digital card or paper"]'::jsonb,
    'Transforms ambitious vision into tangible, motivating milestones.',
    false
),
(
    '11111111-1111-4111-8111-111111111135',
    'Show & Tell: The Book That Changed My Perspective',
    'Present a book, essay, or documentary that fundamentally shifted the way you view the world.',
    'Conversation Starter', 15, 3, 12, 'All', 'Relaxed', 'Easy',
    '["90-second intro to a transformative piece of writing or film.", "Highlight the key insight that impacted your mindset."]'::jsonb,
    '["Book or media cover"]'::jsonb,
    'Cultivates an intellectual culture of continuous learning and deep curiosity.',
    false
),
(
    '11111111-1111-4111-8111-111111111136',
    'Trivia Championship: Geography & Flags',
    'Test your international knowledge on capital cities, extreme geography, and distinctive flag designs.',
    'Trivia', 12, 4, 50, 'All', 'Casual', 'Medium',
    '["5 international rounds.", "Instant results with geographic trivia."]'::jsonb,
    '["Trivia display"]'::jsonb,
    'Honors global perspectives and sparks travel stories among team members.',
    false
),
(
    '11111111-1111-4111-8111-111111111137',
    'The 30-Second Elevator Mystery',
    'An improvisational warm-up where you pitch a mystery product to a famous historical figure stuck in an elevator.',
    'Quick Game', 8, 4, 20, 'All', 'Creative', 'Medium',
    '["Pair a historical passenger with a modern object.", "30 seconds to pitch why they need it."]'::jsonb,
    '["None"]'::jsonb,
    'Builds spontaneous adaptability and storytelling without prep time.',
    false
),
(
    '11111111-1111-4111-8111-111111111138',
    'The Mindfulness Breathing Anchor',
    'A calming, guided 4-7-8 team breath synchronization to downshift stress before high-stakes presentations.',
    'Conversation Starter', 5, 2, 50, 'All', 'Relaxed', 'Easy',
    '["Gentle posture check.", "Inhale 4s, hold 7s, exhale 8s for 3 cycles.", "One grounding shared check-in."]'::jsonb,
    '["Quiet room"]'::jsonb,
    'Physiologically lowers cortisol and creates shared presence and neurological calm.',
    false
),
(
    '11111111-1111-4111-8111-111111111139',
    'The Office Hall of Fame Induction',
    'Nominate a peer for an honorary award celebrating an unsung hero moment from the past sprint.',
    'Team Building', 10, 4, 30, 'All', 'Casual', 'Easy',
    '["Present 3 fun recognition categories.", "Cast peer votes.", "Winners give 15-second thank-you speeches."]'::jsonb,
    '["Chat or certificates"]'::jsonb,
    'Celebrates invisible contributions and boosts team belonging.',
    false
),
(
    '11111111-1111-4111-8111-111111111140',
    'The Infinite Story Chain',
    'Collaborative storytelling where each person adds exactly one sentence ending with an escalating cliffhanger.',
    'Quick Game', 7, 4, 20, 'All', 'Creative', 'Easy',
    '["Host supplies opening sentence.", "Teammates alternate adding sentences starting with Fortunately or Unfortunately.", "Conclude on round 10."]'::jsonb,
    '["None"]'::jsonb,
    'Teaches listening, spontaneous narrative agreement (Yes, And!), and shared creativity.',
    false
)
ON CONFLICT (id) DO NOTHING;
