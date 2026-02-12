import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { testQuestions } from './ClientHuntingData';

export default function ClientHuntingTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const correctCount = selectedAnswers.filter(
    (answer, index) => answer === testQuestions[index].correctAnswer
  ).length;
  const percentage = Math.round((correctCount / testQuestions.length) * 100);

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    localStorage.removeItem('clientHuntingTestResults');
  };

  const saveResults = () => {
    const passed = percentage >= 80;
    localStorage.setItem(
      'clientHuntingTestResults',
      JSON.stringify({
        score: percentage,
        correctCount,
        totalQuestions: testQuestions.length,
        passed,
        completedAt: new Date().toISOString()
      })
    );
  };

  if (showResults && percentage >= 80) {
    saveResults();
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Тестирование знаний
            </h2>
            <p className="text-slate-400">
              Проверьте, насколько хорошо вы усвоили материал
            </p>
          </motion.div>

          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-400">
                          Вопрос {currentQuestion + 1} из {testQuestions.length}
                        </span>
                        <div className="flex gap-1">
                          {testQuestions.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentQuestion
                                  ? 'bg-cyan-500'
                                  : index < currentQuestion
                                  ? 'bg-cyan-500/50'
                                  : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-6">
                        {testQuestions[currentQuestion].question}
                      </h3>

                      <div className="space-y-3">
                        {testQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full justify-start text-left p-4 h-auto ${
                              selectedAnswers[currentQuestion] === index
                                ? selectedAnswers[currentQuestion] ===
                                  testQuestions[currentQuestion].correctAnswer
                                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                                  : 'bg-gradient-to-r from-red-600 to-orange-600'
                                : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                            disabled={selectedAnswers[currentQuestion] !== undefined}
                          >
                            <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Button>
                        ))}
                      </div>

                      {selectedAnswers[currentQuestion] !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg"
                        >
                          <p className="text-sm text-cyan-400">
                            {testQuestions[currentQuestion].explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div
                      className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                        percentage >= 80
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-orange-500 to-red-600'
                      }`}
                    >
                      <Icon
                        name={percentage >= 80 ? 'CheckCircle' : 'XCircle'}
                        size={64}
                        className="text-white"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-2">
                      {percentage}%
                    </h3>
                    <p className="text-lg text-slate-400 mb-6">
                      {correctCount} из {testQuestions.length} правильных ответов
                    </p>

                    {percentage >= 80 ? (
                      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-6 mb-6">
                        <Icon name="Award" size={48} className="text-green-400 mx-auto mb-3" />
                        <p className="text-lg font-semibold text-green-400 mb-2">
                          Отличный результат!
                        </p>
                        <p className="text-sm text-slate-300">
                          Вы успешно прошли тест и усвоили материал по охоте за клиентами.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-6 mb-6">
                        <Icon name="AlertCircle" size={48} className="text-orange-400 mx-auto mb-3" />
                        <p className="text-lg font-semibold text-orange-400 mb-2">
                          Требуется повторение
                        </p>
                        <p className="text-sm text-slate-300">
                          Для прохождения теста необходимо набрать минимум 80%. Повторите материал и попробуйте снова.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Button
                        onClick={restartTest}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      >
                        <Icon name="RotateCcw" className="mr-2" size={18} />
                        Пройти тест заново
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
