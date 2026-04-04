import { useState } from "react";

const EMPTY_ANALYSIS = {
  insights: [],
  recommendations: [],
  possibleOutcomes: [],
};

const normalizeAnalysis = (analysis) => ({
  insights: Array.isArray(analysis?.insights) ? analysis.insights : [],
  recommendations: Array.isArray(analysis?.recommendations)
    ? analysis.recommendations
    : [],
  possibleOutcomes: Array.isArray(
    analysis?.possible_outcomes || analysis?.possibleOutcomes,
  )
    ? analysis.possible_outcomes || analysis.possibleOutcomes
    : [],
});

const normalizeResponseData = (response) => response?.data || response || {};

export default function useChartSummaryModal({
  fetchSummary,
  fallbackError = "Could not generate summary right now. Please try again.",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summaryLines, setSummaryLines] = useState([]);
  const [analysis, setAnalysis] = useState(EMPTY_ANALYSIS);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openSummary = async ({ chartType, fallbackTitle, context = {} }) => {
    setIsOpen(true);
    setTitle(fallbackTitle);
    setSummaryLines([]);
    setAnalysis(EMPTY_ANALYSIS);
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchSummary(chartType, context);
      const data = normalizeResponseData(response);

      setTitle(data.title || fallbackTitle);
      setSummaryLines(
        Array.isArray(data.summary) && data.summary.length > 0
          ? data.summary
          : ["No summary details are currently available for this chart."],
      );
      setAnalysis(normalizeAnalysis(data.analysis));
    } catch (requestError) {
      setError(requestError?.response?.data?.error || fallbackError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    title,
    summaryLines,
    analysis,
    error,
    isLoading,
    openSummary,
  };
}
