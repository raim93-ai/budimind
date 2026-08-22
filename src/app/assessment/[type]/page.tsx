'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assessments } from '@/db/assessments';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AssessmentFormPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  
  // Get assessment definition
  const assessment = (assessments as any)[type];
  
  if (!assessment) {
    // Handle missing assessment
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
        <div className="washi-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
          <p className="text-muted-foreground">The assessment you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/assessment" className="button-secondary">
              Back to Assessments
            </a>
          </Button>
        </div>
      </div>
    );
  }
  
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    icNumber: '',
    email: '',
    age: '',
    gender: '',
    phone: '',
    companyId: ''
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<number[]>([]);

  // Logged-in clients skip the demographics step — results attach to their account
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.role) setSessionRole(d.role); })
      .catch(() => {})
      .finally(() => setSessionChecked(true));
  }, []);

  
  // Handle patient info form submission
  const handlePatientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!patientInfo.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    // Move to first question
    setCurrentQuestionIndex(1); // Start at question 1 (0-based index for questions array)
  };
  
  // Handle question submission
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For simplicity, we'll assume the response is captured via state
    // In a real implementation, we'd use react-hook-form for each question
    setCurrentQuestionIndex(prev => prev + 1);
    
    // Check if we're done
    if (currentQuestionIndex >= assessment.questions.length) {
      setShowResult(true);
    }
  };
  
  // Handle restart
  const handleRestart = () => {
    setPatientInfo({
      fullName: '',
      icNumber: '',
      email: '',
      age: '',
      gender: '',
      phone: '',
      companyId: ''
    });
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setResponses([]);
  };
  
  // Patient Info Form
  if (!sessionChecked) {
    return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (currentQuestionIndex === 0 && sessionRole !== 'client') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
        <form onSubmit={handlePatientInfoSubmit} className="washi-card w-full max-w-md space-y-6">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-bold">
              {assessment.title}
            </h2>
          </div>
          <p className="text-center text-muted-foreground max-w-xl">
            {assessment.description}
          </p>
          <p className="text-sm text-muted-foreground">
            {assessment.instructions}
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlValue="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={patientInfo.fullName}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlValue="icNumber">IC Number (Optional)</Label>
                <Input
                  id="icNumber"
                  placeholder="National ID / IC"
                  value={patientInfo.icNumber}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, icNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlValue="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlValue="age">Age (Optional)</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlValue="gender">Gender (Optional)</Label>
                <select
                  id="gender"
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="select w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlValue="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlValue="companyId">Organization ID (Optional)</Label>
                <Input
                  id="companyId"
                  type="number"
                  placeholder="Organization ID"
                  value={patientInfo.companyId}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, companyId: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Begin Assessment
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Your information will be kept confidential and used only for assessment purposes.
          </p>
        </form>
      </div>
    );
  }
  
  // Question Form
  if (currentQuestionIndex > 0 && currentQuestionIndex <= assessment.questions.length && !showResult) {
    const question = assessment.questions[currentQuestionIndex - 1]; // Adjust for 0-based index
    
    // Determine input type based on question
    const isTextQuestion = question.text.toLowerCase().includes('describe') || 
                          question.text.toLowerCase().includes('explain') ||
                          question.text.toLowerCase().includes('details');
    
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
        <form onSubmit={handleQuestionSubmit} className="washi-card w-full max-w-xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="hanko-badge">
                Question {currentQuestionIndex} of {assessment.questions.length}
              </div>
              <h2 className="text-xl font-bold">{assessment.title}</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round((currentQuestionIndex / assessment.questions.length) * 100)}% Complete
            </div>
          </div>
          
          <div className="bg-primary/50 p-4 rounded-lg mb-6">
            <p className="text-lg">{question.text}</p>
            {question.alternative_texts && (
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>Choose the statement that best describes you:</strong>
                <div className="mt-2 space-y-1">
                  {[question.text, ...question.alternative_texts].map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="response"
                        value={index}
                        checked={responses[currentQuestionIndex - 1] === index}
                        onChange={(e) => {
                          const newResponses = [...responses];
                          newResponses[currentQuestionIndex - 1] = parseInt(e.target.value);
                          setResponses(newResponses);
                        }}
                        className="h-4 w-4"
                      />
                      <label className="cursor-pointer">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {!question.alternative_texts && (
            <>
              <Label htmlValue="response">Your Response</Label>
              {isTextQuestion ? (
                <Textarea
                  id="response"
                  placeholder="Please provide your response here..."
                  value={responses[currentQuestionIndex - 1] || ''}
                  onChange={(e) => {
                    // For text responses, we'd need a different approach
                    // For now, we'll just store length as a proxy
                    const newResponses = [...responses];
                    newResponses[currentQuestionIndex - 1] = e.target.value.length;
                    setResponses(newResponses);
                  }}
                  rows={4}
                />
              ) : (
                <div className="space-y-3">
                  {/* Standard 0-4 Likert scale */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>0</span>
                    <div className="flex-1 h-0.5 bg-muted/50 mx-2" />
                    <span>4</span>
                  </div>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3, 4].map(value => (
                      <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="response"
                          value={value}
                          checked={responses[currentQuestionIndex - 1] === value}
                          onChange={(e) => {
                            const newResponses = [...responses];
                            newResponses[currentQuestionIndex - 1] = parseInt(e.target.value);
                            setResponses(newResponses);
                          }}
                          className="h-4 w-4"
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                    <span>0 = Not at all</span>
                    <span className="mx-4">2 = Moderately</span>
                    <span>4 = Extremely</span>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              variant="secondary"
              disabled={currentQuestionIndex <= 1}
            >
              Previous Question
            </Button>
            
            <Button 
              type={currentQuestionIndex === assessment.questions.length ? 'submit' : 'button'}
              disabled={submitting}
            >
              {currentQuestionIndex === assessment.questions.length ? 'Submit Assessment' : 'Next Question'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            There are no right or wrong answers. Please respond based on how you have been feeling recently.
          </p>
        </form>
      </div>
    );
  }
  
  // Results Page
  if (showResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
        <div className="washi-card w-full max-w-xl space-y-8">
          <div className="flex items-center justify-center">
            <h2 className="text-2xl font-bold">
              Assessment Complete
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Submit to API */}
            <div id="api-response"></div>
            
            <Button 
              type="button" 
              onClick={async () => {
                setSubmitting(true);
                try {
                  // Score the responses
                  const scores = assessment.scoringFn(responses);
                  
                  // Submit to API
                  const response = await fetch('/api/assessments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      patientInfo,
                      assessmentType: type,
                      responses,
                    }),
                  });
                  
                  const result = await response.json();
                  
                  if (response.ok) {
                    // Show success message
                    document.getElementById('api-response')!.innerHTML = `
                      <div className="bg-success/20 text-success p-4 rounded-lg mb-4">
                        Assessment submitted successfully! Your patient ID is: ${result.patientId}
                      </div>
                    `;
                    
                    // Auto-redirect to result page after delay
                    setTimeout(() => {
                      router.push(`/assessment/${type}/result?patientId=${result.patientId}&assessmentId=${result.assessmentId}`);
                    }, 2000);
                  } else {
                    throw new Error(result.error || 'Failed to submit assessment');
                  }
                } catch (error) {
                  document.getElementById('api-response')!.innerHTML = `
                    <div className="bg-destructive/20 text-destructive p-4 rounded-lg mb-4">
                      Error: ${error instanceof Error ? error.message : 'Unknown error'}
                    </div>
                  `;
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          </div>
          
          <Button 
            type="button" 
            onClick={handleRestart}
            variant="secondary"
            className="w-full mt-4"
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }
  
  // Fallback (shouldn't reach here)
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
      <div className="washi-card p-8 text-center">
        <h2 className="text-2xl font-bold">Assessment Form</h2>
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    </div>
  );
}