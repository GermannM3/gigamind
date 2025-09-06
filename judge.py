from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class TinyJudge:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def evaluate(self, query, response, memory_context=""):
        # Простая эвристика: оцениваем тональность и длину
        sentiment = self.analyzer.polarity_scores(response)['compound']
        relevance = 5 if len(response) > 10 else 3
        empathy = 5 if sentiment > 0.1 else 3
        usefulness = 5 if "://" not in response else 4  # если ссылка — полезно

        score = round((relevance + empathy + usefulness) / 3, 1)
        return score, f"Sentiment: {sentiment:.2f}, Relevance: {relevance}, Empathy: {empathy}"

# Позже заменим на Phi-3-mini