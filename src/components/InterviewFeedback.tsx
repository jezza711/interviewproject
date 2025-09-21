import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_QUESTIONS = [
  "Why do you want to study medicine in the UK?",
  "Describe a time when you demonstrated empathy in a healthcare setting.",
  "How would you handle a situation where a patient refuses treatment?",
  "What qualities make a good doctor?",
  "Tell me about a recent medical advancement and its impact on patient care.",
  "How would you deal with ethical dilemmas in medicine?",
  "Describe a time you worked effectively in a team, especially under pressure.",
  "How would you communicate bad news to a patient or their family?",
  "What challenges do you think the NHS faces today?",
  "How do you manage stress and maintain resilience in demanding situations?"
];

export const InterviewFeedback = () => {
  const [currentQuestion, setCurrentQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [answer, setAnswer] = useState("");
  // API key is now internal for both providers
  // Always use Gemini
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const GEMINI_API_KEY = "AIzaSyB4BgtXf86M3QeEMVLJ3nGsYloog0s64YE";

  const generateFeedback = async () => {
    if (!answer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer to get feedback.",
        variant: "destructive",
      });
      return;
    }
    // No API key input required

    setIsLoading(true);
    setError("");
    setFeedback("");

    try {
      let response;
      
      // Always use Gemini API
  response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert interview coach. Provide constructive, detailed feedback on interview answers. Focus on strengths, areas for improvement, and specific suggestions for better responses. Be encouraging but honest.

Interview Question: ${currentQuestion}

Candidate Answer: ${answer}

Please provide detailed feedback on this interview response keep it at 750 characters.`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      let feedbackText;
      
      feedbackText = data.candidates[0]?.content?.parts[0]?.text || "No feedback generated.";
      
      setFeedback(feedbackText);
      
      toast({
        title: "Feedback Generated!",
        description: "Your AI feedback is ready for review.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate feedback";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNewQuestion = () => {
    const availableQuestions = SAMPLE_QUESTIONS.filter(q => q !== currentQuestion);
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setAnswer("");
    setFeedback("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Interview Feedback
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice your interview skills and get instant AI-powered feedback to improve your responses
          </p>
        </div>

        {/* Gemini is always used, no provider selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Google Gemini is enabled with a built-in key.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Interview Question
              </CardTitle>
              <Button variant="outline" onClick={getNewQuestion}>
                New Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary text-primary-foreground p-6 rounded-lg">
              <p className="text-lg leading-relaxed">{currentQuestion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
            <CardDescription>
              Take your time to craft a thoughtful response. Aim for 2-3 minutes of speaking content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-32 resize-none"
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {answer.length}/2000 characters
              </span>
              <Button
                onClick={generateFeedback}
                disabled={isLoading || !answer.trim()}
                variant={isLoading ? "loading" : "default"}
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Get AI Feedback"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="shadow-card border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Display */}
        {feedback && (
          <Card className="shadow-card border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{feedback}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};