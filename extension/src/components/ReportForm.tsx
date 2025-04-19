import React, { useState } from 'react';

interface ReportFormProps {
  articleUrl: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ articleUrl }) => {
  const [reason, setReason] = useState<string>('incorrect_analysis');
  const [comment, setComment] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleUrl,
          reason,
          comment,
          userReference: email || undefined,
          timestamp: Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit the report. Please try again later.');
      console.error('Error submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-truthlens-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="font-medium">Report Submitted Successfully</h3>
        </div>
        <p className="text-sm mb-3">
          Thank you for your feedback! Your report helps us improve the accuracy of our analysis.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="btn btn-primary mt-2 w-full"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Report an Issue</h2>
      <p className="text-sm mb-4">
        Help us improve by reporting any inaccuracies or issues with this article's analysis.
      </p>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Reporting
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-truthlens-primary focus:border-truthlens-primary"
            required
          >
            <option value="incorrect_analysis">Incorrect Analysis</option>
            <option value="missed_context">Important Context Missing</option>
            <option value="factual_error">Factual Error in Article</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-truthlens-primary focus:border-truthlens-primary"
            rows={3}
            placeholder="Please provide more details about the issue..."
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-truthlens-primary focus:border-truthlens-primary"
            placeholder="your@email.com"
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll only use this to follow up if needed.
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm; 