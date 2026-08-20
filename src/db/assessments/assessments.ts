import { Assessment, ScoringResult } from './types';

// ============================================================================
// DASS-21: Depression Anxiety Stress Scales
// ============================================================================
export const dass21: Assessment = {
  title: 'DASS-21',
  description: 'Depression Anxiety Stress Scales - measures three negative emotional states',
  instructions: 'Please read each statement and select a number 0, 1, 2 or 3 which indicates how much the statement applied to you over the past week. There are no right or wrong answers.',
  questions: [
    { text: 'I found it hard to wind down' }, // Stress
    { text: 'I was aware of dryness of my mouth' }, // Anxiety
    { text: 'I could not seem to experience any positive feeling at all' }, // Depression
    { text: 'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)' }, // Anxiety
    { text: 'I found it difficult to work up the initiative to do things' }, // Depression
    { text: 'I tended to over-react to situations' }, // Stress
    { text: 'I experienced trembling (e.g., in the hands)' }, // Anxiety
    { text: 'I felt that I was using a lot of nervous energy' }, // Stress
    { text: 'I was worried about situations in which I might panic and make a fool of myself' }, // Anxiety
    { text: 'I felt that I had nothing to look forward to' }, // Depression
    { text: 'I found myself getting agitated' }, // Stress
    { text: 'I found it difficult to relax' }, // Stress
    { text: 'I felt down-hearted and blue' }, // Depression
    { text: 'I was intolerant of anything that kept me from getting on with what I was doing' }, // Stress
    { text: 'I felt I was close to panic' }, // Anxiety
    { text: 'I was unable to become enthusiastic about anything' }, // Depression
    { text: 'I felt I was not worth much as a person' }, // Depression
    { text: 'I felt that I was rather touchy' }, // Stress
    { text: 'I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)' }, // Anxiety
    { text: 'I felt scared without any good reason' }, // Anxiety
    { text: 'I felt that life was meaningless' }, // Depression
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    // DASS-21 has 21 items, 7 per subscale
    // Depression: items 3, 5, 10, 13, 16, 17, 21 (0-indexed: 2, 4, 9, 12, 15, 16, 20)
    // Anxiety: items 2, 4, 7, 9, 15, 19, 20 (0-indexed: 1, 3, 6, 8, 14, 18, 19)
    // Stress: items 1, 6, 8, 11, 12, 14, 18 (0-indexed: 0, 5, 7, 10, 11, 13, 17)
    
    const depressionItems = [2, 4, 9, 12, 15, 16, 20];
    const anxietyItems = [1, 3, 6, 8, 14, 18, 19];
    const stressItems = [0, 5, 7, 10, 11, 13, 17];
    
    const depression = depressionItems.reduce((sum, i) => sum + (responses[i] || 0), 0) * 2;
    const anxiety = anxietyItems.reduce((sum, i) => sum + (responses[i] || 0), 0) * 2;
    const stress = stressItems.reduce((sum, i) => sum + (responses[i] || 0), 0) * 2;
    const total = depression + anxiety + stress;
    
    // Severity thresholds (after multiplying by 2)
    // Depression: 0-9 normal, 10-13 mild, 14-20 moderate, 21-27 severe, 28+ extremely severe
    // Anxiety: 0-7 normal, 8-9 mild, 10-14 moderate, 15-19 severe, 20+ extremely severe
    // Stress: 0-14 normal, 15-18 mild, 19-25 moderate, 26-33 severe, 34+ extremely severe
    
    let severity = 'normal';
    if (depression >= 28 || anxiety >= 20 || stress >= 34) severity = 'extremely severe';
    else if (depression >= 21 || anxiety >= 15 || stress >= 26) severity = 'severe';
    else if (depression >= 14 || anxiety >= 10 || stress >= 19) severity = 'moderate';
    else if (depression >= 10 || anxiety >= 8 || stress >= 15) severity = 'mild';
    
    return {
      total,
      depression,
      anxiety,
      stress,
      severity,
      interpretation: `Depression: ${depression}/42, Anxiety: ${anxiety}/42, Stress: ${stress}/42. ${severity.charAt(0).toUpperCase() + severity.slice(1)} severity.`
    };
  }
};

// ============================================================================
// PHQ-9: Patient Health Questionnaire - 9 item depression screening
// ============================================================================
export const phq9: Assessment = {
  title: 'PHQ-9',
  description: 'Patient Health Questionnaire - 9-item depression screening',
  instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  questions: [
    { text: 'Little interest or pleasure in doing things' },
    { text: 'Feeling down, depressed, or hopeless' },
    { text: 'Trouble falling or staying asleep, or sleeping too much' },
    { text: 'Feeling tired or having little energy' },
    { text: 'Poor appetite or overeating' },
    { text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
    { text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
    { text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual' },
    { text: 'Thoughts that you would be better off dead, or of hurting yourself in some way' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'minimal';
    if (total >= 20) severity = 'severe';
    else if (total >= 15) severity = 'moderately severe';
    else if (total >= 10) severity = 'moderate';
    else if (total >= 5) severity = 'mild';
    
    const interpretations = {
      minimal: 'Minimal or no depression',
      mild: 'Mild depression',
      moderate: 'Moderate depression',
      'moderately severe': 'Moderately severe depression',
      severe: 'Severe depression'
    };
    
    return {
      total,
      severity,
      interpretation: `${interpretations[severity as keyof typeof interpretations]} (Score: ${total}/27)`
    };
  }
};

// ============================================================================
// GAD-7: Generalized Anxiety Disorder - 7 item anxiety screening
// ============================================================================
export const gad7: Assessment = {
  title: 'GAD-7',
  description: 'Generalized Anxiety Disorder - 7-item anxiety screening',
  instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  questions: [
    { text: 'Feeling nervous, anxious, or on edge' },
    { text: 'Not being able to stop or control worrying' },
    { text: 'Worrying too much about different things' },
    { text: 'Trouble relaxing' },
    { text: 'Being so restless that it is hard to sit still' },
    { text: 'Becoming easily annoyed or irritable' },
    { text: 'Feeling afraid as if something awful might happen' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'minimal';
    if (total >= 15) severity = 'severe';
    else if (total >= 10) severity = 'moderate';
    else if (total >= 5) severity = 'mild';
    
    const interpretations = {
      minimal: 'Minimal anxiety',
      mild: 'Mild anxiety',
      moderate: 'Moderate anxiety',
      severe: 'Severe anxiety'
    };
    
    return {
      total,
      severity,
      interpretation: `${interpretations[severity as keyof typeof interpretations]} (Score: ${total}/21)`
    };
  }
};

// ============================================================================
// WHO-5: Well-Being Index
// ============================================================================
export const who5: Assessment = {
  title: 'WHO-5',
  description: 'Well-Being Index - 5-item mental well-being screening',
  instructions: 'Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.',
  questions: [
    { text: 'I have felt cheerful and in good spirits' },
    { text: 'I have felt calm and relaxed' },
    { text: 'I have felt active and vigorous' },
    { text: 'I woke up feeling fresh and rested' },
    { text: 'My daily life has been filled with things that interest me' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    // WHO-5 raw score 0-25, typically multiplied by 4 to get percentage 0-100
    const percentage = total * 4;
    
    let severity = 'normal';
    if (percentage <= 28) severity = 'poor well-being (possible depression)';
    else if (percentage <= 50) severity = 'low well-being';
    else if (percentage <= 72) severity = 'moderate well-being';
    else severity = 'good well-being';
    
    return {
      total,
      percentage,
      severity,
      interpretation: `Well-being score: ${percentage}/100 (raw: ${total}/25). ${severity.charAt(0).toUpperCase() + severity.slice(1)}.`
    };
  }
};

// ============================================================================
// PCL-5: PTSD Checklist for DSM-5
// ============================================================================
export const pcl5: Assessment = {
  title: 'PCL-5',
  description: 'PTSD Checklist - 20-item PTSD symptom screening',
  instructions: 'Below is a list of problems that people sometimes have in response to a very stressful experience. Please read each problem carefully and then select the number that indicates how much you have been bothered by that problem in the past month.',
  questions: [
    { text: 'Repeated, disturbing, and unwanted memories of the stressful experience?' },
    { text: 'Repeated, disturbing dreams of the stressful experience?' },
    { text: 'Suddenly feeling or acting as if the stressful experience were actually happening again?' },
    { text: 'Feeling very upset when something reminded you of the stressful experience?' },
    { text: 'Having strong physical reactions when something reminded you of the stressful experience?' },
    { text: 'Avoiding memories, thoughts, or feelings related to the stressful experience?' },
    { text: 'Avoiding external reminders of the stressful experience?' },
    { text: 'Trouble remembering important parts of the stressful experience?' },
    { text: 'Having strong negative beliefs about yourself, other people, or the world?' },
    { text: 'Blaming yourself or someone else for the stressful experience or what happened after it?' },
    { text: 'Having strong negative feelings such as fear, horror, anger, guilt, or shame?' },
    { text: 'Loss of interest in activities that you used to enjoy?' },
    { text: 'Feeling distant or cut off from other people?' },
    { text: 'Trouble experiencing positive feelings?' },
    { text: 'Irritable behavior, angry outbursts, or acting aggressively?' },
    { text: 'Taking too many risks or doing things that could cause you harm?' },
    { text: 'Being "superalert" or watchful or on guard?' },
    { text: 'Feeling jumpy or easily startled?' },
    { text: 'Having difficulty concentrating?' },
    { text: 'Trouble falling or staying asleep?' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    // Also calculate cluster scores for DSM-5 clusters
    // B: Intrusion (items 1-5): indices 0-4
    // C: Avoidance (items 6-7): indices 5-6
    // D: Negative alterations in cognitions/mood (items 8-14): indices 7-13
    // E: Alterations in arousal/reactivity (items 15-20): indices 14-19
    
    const intrusion = [0,1,2,3,4].reduce((sum, i) => sum + (responses[i] || 0), 0);
    const avoidance = [5,6].reduce((sum, i) => sum + (responses[i] || 0), 0);
    const cognition = [7,8,9,10,11,12,13].reduce((sum, i) => sum + (responses[i] || 0), 0);
    const arousal = [14,15,16,17,18,19].reduce((sum, i) => sum + (responses[i] || 0), 0);
    
    let severity = 'subclinical';
    if (total >= 50) severity = 'probable PTSD';
    else if (total >= 31) severity = 'moderate';
    else if (total >= 20) severity = 'mild';
    
    return {
      total,
      intrusion,
      avoidance,
      cognition,
      arousal,
      severity,
      interpretation: `Total: ${total}/80. ${severity.charAt(0).toUpperCase() + severity.slice(1)} PTSD symptoms. Clusters - Intrusion: ${intrusion}/20, Avoidance: ${avoidance}/8, Cognition/Mood: ${cognition}/28, Arousal: ${arousal}/24.`
    };
  }
};

// ============================================================================
// EPDS: Edinburgh Postnatal Depression Scale
// ============================================================================
export const epds: Assessment = {
  title: 'EPDS',
  description: 'Edinburgh Postnatal Depression Scale - 10-item postpartum depression screening',
  instructions: 'As you are pregnant or have recently had a baby, we would like to know how you are feeling. Please check the answer that comes closest to how you have felt IN THE PAST 7 DAYS.',
  questions: [
    { text: 'I have been able to laugh and see the funny side of things' },
    { text: 'I have looked forward with enjoyment to things' },
    { text: 'I have blamed myself unnecessarily when things went wrong' },
    { text: 'I have been anxious or worried for no good reason' },
    { text: 'I have felt scared or panicky for no very good reason' },
    { text: 'Things have been getting on top of me' },
    { text: 'I have been so unhappy that I have had difficulty sleeping' },
    { text: 'I have felt sad or miserable' },
    { text: 'I have been so unhappy that I have been crying' },
    { text: 'The thought of harming myself has occurred to me' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    // EPDS has reverse-scored items (1, 2) and regular items (3-10)
    // Items 1, 2: 0=As much as I always could, 1=Not quite so much now, 2=Definitely not so much now, 3=Not at all
    // Items 3-10: 0=Not at all, 1=From time to time, 2=Quite often, 3=Yes, most of the time
    // But in our 0-4 scale, we need to adjust. Let's assume responses are already normalized 0-3.
    
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'unlikely depression';
    if (total >= 13) severity = 'probable major depression';
    else if (total >= 10) severity = 'possible depression';
    
    return {
      total,
      severity,
      interpretation: `Score: ${total}/30. ${severity.charAt(0).toUpperCase() + severity.slice(1)}. Score ≥10 suggests possible depression; ≥13 suggests probable major depression.`
    };
  }
};

// ============================================================================
// K10: Kessler Psychological Distress Scale
// ============================================================================
export const k10: Assessment = {
  title: 'K10',
  description: 'Kessler Psychological Distress Scale - 10-item measure of psychological distress',
  instructions: 'The following questions ask about how you have been feeling during the past 30 days. For each question, select the number that best describes how often you had this feeling.',
  questions: [
    { text: 'During the last 30 days, about how often did you feel tired out for no good reason?' },
    { text: 'During the last 30 days, about how often did you feel nervous?' },
    { text: 'During the last 30 days, about how often did you feel so nervous that nothing could calm you down?' },
    { text: 'During the last 30 days, about how often did you feel hopeless?' },
    { text: 'During the last 30 days, about how often did you feel restless or fidgety?' },
    { text: 'During the last 30 days, about how often did you feel so restless you could not sit still?' },
    { text: 'During the last 30 days, about how often did you feel depressed?' },
    { text: 'During the last 30 days, about how often did you feel that everything was an effort?' },
    { text: 'During the last 30 days, about how often did you feel so sad that nothing could cheer you up?' },
    { text: 'During the last 30 days, about how often did you feel worthless?' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'likely well';
    if (total >= 30) severity = 'severe mental disorder likely';
    else if (total >= 25) severity = 'moderate mental disorder likely';
    else if (total >= 20) severity = 'mild mental disorder likely';
    
    return {
      total,
      severity,
      interpretation: `Score: ${total}/40. ${severity.charAt(0).toUpperCase() + severity.slice(1)}.`
    };
  }
};

// ============================================================================
// ASRS: Adult ADHD Self-Report Scale v1.1
// ============================================================================
export const asrs: Assessment = {
  title: 'ASRS v1.1',
  description: 'Adult ADHD Self-Report Scale - 6-item screener',
  instructions: 'Please answer the questions below, rating yourself on each of the criteria shown using the scale on the right side of the page.',
  questions: [
    { text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?' },
    { text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?' },
    { text: 'How often do you have problems remembering appointments or obligations?' },
    { text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?' },
    { text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?' },
    { text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    // ASRS v1.1: Items 1-3 are inattention, 4-6 are hyperactivity
    // Part A (items 1, 2, 3, 4, 5, 6) - 4 or more shaded responses suggests ADHD
    // Scoring: Sometimes=1, Often=2, Very Often=3 (0=Never, 1=Rarely)
    // But our scale is 0-4. Let's map: 0-1=Never/Rarely, 2=Sometimes, 3=Often, 4=Very Often
    
    const partAResponses = responses.filter(r => (r || 0) >= 2).length;
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'unlikely ADHD';
    if (partAResponses >= 4) severity = 'probable ADHD';
    else if (partAResponses >= 2) severity = 'possible ADHD';
    
    return {
      total,
      partAScore: partAResponses,
      severity,
      interpretation: `Part A positive responses: ${partAResponses}/6. ${severity.charAt(0).toUpperCase() + severity.slice(1)}. Score ≥4 on Part A suggests ADHD.`
    };
  }
};

// ============================================================================
// ISI: Insomnia Severity Index
// ============================================================================
export const isi: Assessment = {
  title: 'ISI',
  description: 'Insomnia Severity Index - 7-item insomnia screening',
  instructions: 'Please rate the CURRENT (i.e., LAST 2 WEEKS) SEVERITY of your insomnia problem(s).',
  questions: [
    { text: 'Difficulty falling asleep' },
    { text: 'Difficulty staying asleep' },
    { text: 'Problem waking up too early' },
    { text: 'How satisfied/dissatisfied are you with your current sleep pattern?' },
    { text: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?' },
    { text: 'How worried/distressed are you about your current sleep problem?' },
    { text: 'How much do you consider your sleep problem to INTERFERE with your daily functioning?' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'no clinically significant insomnia';
    if (total >= 22) severity = 'severe insomnia';
    else if (total >= 15) severity = 'moderate insomnia';
    else if (total >= 8) severity = 'subthreshold insomnia';
    
    return {
      total,
      severity,
      interpretation: `Score: ${total}/28. ${severity.charAt(0).toUpperCase() + severity.slice(1)}.`
    };
  }
};

// ============================================================================
// BDI-II: Beck Depression Inventory-II
// ============================================================================
export const bdi2: Assessment = {
  title: 'BDI-II',
  description: 'Beck Depression Inventory-II - 21-item depression assessment',
  instructions: 'This questionnaire consists of 21 groups of statements. Please read each group of statements carefully, and then pick out the one statement in each group that best describes the way you have been feeling during the past two weeks, including today.',
  questions: [
    { text: 'Sadness', alternative_texts: ['I do not feel sad.', 'I feel sad much of the time.', 'I am sad all the time.', 'I am so sad or unhappy that I can\'t stand it.'] },
    { text: 'Pessimism', alternative_texts: ['I am not discouraged about my future.', 'I feel more discouraged about my future than I used to be.', 'I do not expect things to work out for me.', 'I feel my future is hopeless and will only get worse.'] },
    { text: 'Past Failure', alternative_texts: ['I do not feel like a failure.', 'I have failed more than I should have.', 'As I look back, I see a lot of failures.', 'I feel I am a total failure as a person.'] },
    { text: 'Loss of Pleasure', alternative_texts: ['I get as much pleasure as I ever did from the things I enjoy.', 'I don\'t enjoy things as much as I used to.', 'I get very little pleasure from the things I used to enjoy.', 'I can\'t get any pleasure from the things I used to enjoy.'] },
    { text: 'Guilty Feelings', alternative_texts: ['I don\'t feel particularly guilty.', 'I feel guilty over many things I have done or should have done.', 'I feel quite guilty most of the time.', 'I feel guilty all of the time.'] },
    { text: 'Punishment Feelings', alternative_texts: ['I don\'t feel I am being punished.', 'I feel I may be punished.', 'I expect to be punished.', 'I feel I am being punished.'] },
    { text: 'Self-Dislike', alternative_texts: ['I feel the same about myself as ever.', 'I have lost confidence in myself.', 'I am disappointed in myself.', 'I dislike myself.'] },
    { text: 'Self-Criticalness', alternative_texts: ['I don\'t criticize or blame myself more than usual.', 'I am more critical of myself than I used to be.', 'I criticize myself for all of my faults.', 'I blame myself for everything bad that happens.'] },
    { text: 'Suicidal Thoughts or Wishes', alternative_texts: ['I don\'t have any thoughts of killing myself.', 'I have thoughts of killing myself, but I would not carry them out.', 'I would like to kill myself.', 'I would kill myself if I had the chance.'] },
    { text: 'Crying', alternative_texts: ['I don\'t cry any more than I used to.', 'I cry more than I used to.', 'I cry over every little thing.', 'I feel like crying, but I can\'t.'] },
    { text: 'Agitation', alternative_texts: ['I am no more restless or wound up than usual.', 'I feel more restless or wound up than usual.', 'I am so restless or agitated that it\'s hard to stay still.', 'I am so restless or agitated that I have to keep moving or doing something.'] },
    { text: 'Loss of Interest', alternative_texts: ['I have not lost interest in other people or activities.', 'I am less interested in other people or things than before.', 'I have lost most of my interest in other people or things.', 'It\'s hard to get interested in anything.'] },
    { text: 'Indecisiveness', alternative_texts: ['I make decisions about as well as ever.', 'I find it more difficult to make decisions than usual.', 'I have much greater difficulty in making decisions than I used to.', 'I have trouble making any decisions.'] },
    { text: 'Worthlessness', alternative_texts: ['I do not feel I am worthless.', 'I don\'t consider myself as worthwhile and useful as I used to.', 'I feel more worthless compared to other people.', 'I feel utterly worthless.'] },
    { text: 'Loss of Energy', alternative_texts: ['I have as much energy as ever.', 'I have less energy than I used to have.', 'I don\'t have enough energy to do very much.', 'I don\'t have enough energy to do anything.'] },
    { text: 'Changes in Sleeping Pattern', alternative_texts: ['I have not experienced any change in my sleeping pattern.', 'I sleep somewhat more than usual.', 'I sleep somewhat less than usual.', 'I sleep a lot more than usual.', 'I sleep a lot less than usual.', 'I sleep most of the day.', 'I wake up 1-2 hours early and can\'t get back to sleep.'] },
    { text: 'Irritability', alternative_texts: ['I am no more irritable than usual.', 'I am more irritable than usual.', 'I am much more irritable than usual.', 'I am irritable all the time.'] },
    { text: 'Changes in Appetite', alternative_texts: ['I have not experienced any change in my appetite.', 'My appetite is somewhat less than usual.', 'My appetite is somewhat greater than usual.', 'My appetite is much less than before.', 'My appetite is much greater than usual.', 'I have no appetite at all.', 'I crave food all the time.'] },
    { text: 'Concentration Difficulty', alternative_texts: ['I can concentrate as well as ever.', 'I can\'t concentrate as well as usual.', 'It\'s hard to keep my mind on anything for very long.', 'I find I can\'t concentrate on anything.'] },
    { text: 'Tiredness or Fatigue', alternative_texts: ['I am no more tired or fatigued than usual.', 'I get more tired or fatigued more easily than usual.', 'I am too tired or fatigued to do a lot of the things I used to do.', 'I am too tired or fatigued to do most of the things I used to do.'] },
    { text: 'Loss of Interest in Sex', alternative_texts: ['I have not noticed any recent change in my interest in sex.', 'I am less interested in sex than I used to be.', 'I am much less interested in sex now.', 'I have lost interest in sex completely.'] },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'minimal';
    if (total >= 29) severity = 'severe';
    else if (total >= 20) severity = 'moderate';
    else if (total >= 14) severity = 'mild';
    
    return {
      total,
      severity,
      interpretation: `Score: ${total}/63. ${severity.charAt(0).toUpperCase() + severity.slice(1)} depression.`
    };
  }
};

// ============================================================================
// BAI: Beck Anxiety Inventory
// ============================================================================
export const bai: Assessment = {
  title: 'BAI',
  description: 'Beck Anxiety Inventory - 21-item anxiety assessment',
  instructions: 'Below is a list of common symptoms of anxiety. Please carefully read each item in the list. Indicate how much you have been bothered by each symptom during the PAST WEEK, INCLUDING TODAY.',
  questions: [
    { text: 'Numbness or tingling' },
    { text: 'Feeling hot' },
    { text: 'Wobbliness in legs' },
    { text: 'Unable to relax' },
    { text: 'Fear of worst happening' },
    { text: 'Dizzy or lightheaded' },
    { text: 'Heart pounding/racing' },
    { text: 'Unsteady' },
    { text: 'Terrified or afraid' },
    { text: 'Nervous' },
    { text: 'Feeling of choking' },
    { text: 'Hands trembling' },
    { text: 'Shaky / unsteady' },
    { text: 'Fear of losing control' },
    { text: 'Difficulty breathing' },
    { text: 'Fear of dying' },
    { text: 'Scared' },
    { text: 'Indigestion' },
    { text: 'Faint / lightheaded' },
    { text: 'Face flushed' },
    { text: 'Hot/cold sweats' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'minimal';
    if (total >= 26) severity = 'severe';
    else if (total >= 16) severity = 'moderate';
    else if (total >= 8) severity = 'mild';
    
    return {
      total,
      severity,
      interpretation: `Score: ${total}/63. ${severity.charAt(0).toUpperCase() + severity.slice(1)} anxiety.`
    };
  }
};

// ============================================================================
// Y-BOCS: Yale-Brown Obsessive Compulsive Scale
// ============================================================================
export const ybocs: Assessment = {
  title: 'Y-BOCS',
  description: 'Yale-Brown Obsessive Compulsive Scale - 10-item OCD severity measure',
  instructions: 'The following questions refer to the past week. Please answer based on the average occurrence of each item during the past week up to and including today.',
  questions: [
    { text: 'Time occupied by obsessive thoughts' },
    { text: 'Interference due to obsessive thoughts' },
    { text: 'Distress associated with obsessive thoughts' },
    { text: 'Resistance against obsessions' },
    { text: 'Degree of control over obsessive thoughts' },
    { text: 'Time spent performing compulsive behaviors' },
    { text: 'Interference due to compulsive behaviors' },
    { text: 'Distress associated with compulsive behaviors' },
    { text: 'Resistance against compulsions' },
    { text: 'Degree of control over compulsive behaviors' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    const obsessionSubscale = responses.slice(0, 5).reduce((sum, r) => sum + (r || 0), 0);
    const compulsionSubscale = responses.slice(5, 10).reduce((sum, r) => sum + (r || 0), 0);
    
    let severity = 'subclinical';
    if (total >= 32) severity = 'extreme';
    else if (total >= 24) severity = 'severe';
    else if (total >= 16) severity = 'moderate';
    else if (total >= 8) severity = 'mild';
    
    return {
      total,
      obsessionSubscale,
      compulsionSubscale,
      severity,
      interpretation: `Total: ${total}/40. ${severity.charAt(0).toUpperCase() + severity.slice(1)} OCD. Obsessions: ${obsessionSubscale}/20, Compulsions: ${compulsionSubscale}/20.`
    };
  }
};

// ============================================================================
// WHODAS 2.0: World Health Organization Disability Assessment Schedule 2.0
// ============================================================================
export const whodas2: Assessment = {
  title: 'WHODAS 2.0 (12-item)',
  description: 'World Health Organization Disability Assessment Schedule 2.0 - 12-item version',
  instructions: 'This questionnaire asks about difficulties due to health conditions. Health conditions include diseases or illnesses, other health problems that may be short or long lasting, injuries, mental or emotional problems, and problems with alcohol or drugs.',
  questions: [
    { text: 'Concentrating on doing something for ten minutes?' },
    { text: 'Remembering to do important things?' },
    { text: 'Understanding what people say?' },
    { text: 'Starting and maintaining a conversation?' },
    { text: 'Standing for long periods such as 30 minutes?' },
    { text: 'Standing up from sitting down?' },
    { text: 'Moving around inside your home?' },
    { text: 'Getting out of your home?' },
    { text: 'Walking a long distance such as a kilometre?' },
    { text: 'Washing your whole body?' },
    { text: 'Getting dressed?' },
    { text: 'Dealing with people you do not know?' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    const total = responses.reduce((sum, r) => sum + (r || 0), 0);
    // WHODAS 2.0 12-item: sum 0-48, convert to 0-100
    const percentage = (total / 48) * 100;
    
    let severity = 'no disability';
    if (percentage >= 75) severity = 'extreme disability';
    else if (percentage >= 50) severity = 'severe disability';
    else if (percentage >= 25) severity = 'moderate disability';
    else if (percentage >= 10) severity = 'mild disability';
    
    return {
      total,
      percentage: Math.round(percentage),
      severity,
      interpretation: `Disability score: ${Math.round(percentage)}% (raw: ${total}/48). ${severity.charAt(0).toUpperCase() + severity.slice(1)}.`
    };
  }
};

// ============================================================================
// CORE-OM: Clinical Outcomes in Routine Evaluation - Outcome Measure
// ============================================================================
export const coreom: Assessment = {
  title: 'CORE-OM',
  description: 'Clinical Outcomes in Routine Evaluation - Outcome Measure (34 items)',
  instructions: 'Below are some statements about feelings and thoughts. Please tick the box that best describes your experience of each over the LAST WEEK.',
  questions: [
    { text: 'I have felt tense, anxious or nervous' },
    { text: 'I have felt I have someone to turn to for support when needed' },
    { text: 'I have felt able to cope when things go wrong' },
    { text: 'Talking to people has felt too much for me' },
    { text: 'I have felt panic or terror' },
    { text: 'I have made plans to end my life' },
    { text: 'I have had difficulty getting to sleep or staying asleep' },
    { text: 'I have felt despairing or hopeless' },
    { text: 'I have felt unhappy' },
    { text: 'Unwanted images or memories have been distressing me' },
    { text: 'I have been irritable when with other people' },
    { text: 'I have had difficulty making decisions' },
    { text: 'I have felt criticized by other people' },
    { text: 'I have felt isolated or alone' },
    { text: 'I have felt humiliated or shamed by other people' },
    { text: 'I have had difficulty concentrating' },
    { text: 'I have felt vulnerable in situations where I might be judged' },
    { text: 'My appetite has been affected' },
    { text: 'I have felt like crying' },
    { text: 'I have felt fearful' },
    { text: 'I have felt optimistic about my future' },
    { text: 'I have achieved the things I wanted to' },
    { text: 'I have felt life is worth living' },
    { text: 'I have been able to do most things I needed to' },
    { text: 'I have felt warmth or affection for someone' },
    { text: 'I have felt loved' },
    { text: 'I have enjoyed my relationships' },
    { text: 'I have felt able to ask for help' },
    { text: 'I have felt physically well' },
    { text: 'I have felt confident in myself' },
    { text: 'I have felt optimistic about my future' },
    { text: 'I have felt life is worth living' },
    { text: 'I have felt confident in myself' },
  ],
  scoringFn: (responses: number[]): ScoringResult => {
    // CORE-OM has 34 items, some positively worded (need reverse scoring)
    // Positive items (reverse scored): 2, 3, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 (indices 1,2,20-33)
    // But we only have 34 questions defined above
    
    const positiveItems = [1, 2, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
    let adjustedTotal = 0;
    
    responses.forEach((r, i) => {
      const val = r || 0;
      if (positiveItems.includes(i)) {
        adjustedTotal += (4 - val); // Reverse score (0->4, 4->0)
      } else {
        adjustedTotal += val;
      }
    });
    
    // Mean score (0-4) * 10 for clinical reporting
    const meanScore = (adjustedTotal / 34) * 10;
    
    let severity = 'healthy';
    if (meanScore >= 25) severity = 'severe';
    else if (meanScore >= 15) severity = 'moderate';
    else if (meanScore >= 10) severity = 'mild';
    else if (meanScore >= 5) severity = 'low level';
    
    return {
      total: adjustedTotal,
      meanScore: Math.round(meanScore * 10) / 10,
      severity,
      interpretation: `Mean score: ${Math.round(meanScore * 10) / 10}/40. ${severity.charAt(0).toUpperCase() + severity.slice(1)} distress.`
    };
  }
};

// Export all assessments
export const assessments = {
  dass21,
  phq9,
  gad7,
  who5,
  pcl5,
  epds,
  k10,
  asrs,
  isi,
  bdi2,
  bai,
  ybocs,
  whodas2,
  coreom,
};

export type { Assessment, ScoringResult } from './types';