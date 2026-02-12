import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { audiences, sources, idealClient, bant, cases, mistakes } from './ClientHuntingData';

interface ClientHuntingSectionsProps {
  selectedAudience: number | null;
  setSelectedAudience: (id: number | null) => void;
  selectedSource: number | null;
  setSelectedSource: (id: number | null) => void;
}

export default function ClientHuntingSections({
  selectedAudience,
  setSelectedAudience,
  selectedSource,
  setSelectedSource
}: ClientHuntingSectionsProps) {
  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Целевые аудитории
              </h2>
              <p className="text-slate-400">
                Три приоритетных сегмента с наибольшим ROI
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {audiences.map((audience, index) => (
                <motion.div
                  key={audience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`bg-slate-800/50 border-slate-700 hover:shadow-xl transition-all cursor-pointer ${
                      selectedAudience === audience.id ? 'ring-2 ring-cyan-500' : ''
                    }`}
                    onClick={() => setSelectedAudience(selectedAudience === audience.id ? null : audience.id)}
                  >
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${audience.color} flex items-center justify-center mb-4`}>
                        <Icon name={audience.icon} size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {audience.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        {audience.why}
                      </p>

                      {selectedAudience === audience.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-700 pt-4 mt-4"
                        >
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                            Где искать:
                          </h4>
                          <ul className="space-y-1 mb-4">
                            {audience.howToFind.map((item, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <Icon name="CheckCircle" size={12} className="text-cyan-400 mt-1 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <h4 className="text-sm font-semibold text-purple-400 mb-2">
                            Ключевые контакты:
                          </h4>
                          <ul className="space-y-1">
                            {audience.keyContacts.map((contact, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <Icon name="User" size={12} className="text-purple-400 mt-1 flex-shrink-0" />
                                <span>{contact}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                5 источников качественных лидов
              </h2>
              <p className="text-slate-400">
                От самых холодных до самых конверсионных
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sources.map((source, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`bg-slate-800/50 border-slate-700 hover:shadow-xl transition-all cursor-pointer h-full ${
                      selectedSource === index ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedSource(selectedSource === index ? null : index)}
                  >
                    <div className="p-6 h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${source.color} flex items-center justify-center mb-4`}>
                        <Icon name={source.icon} size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {source.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        {source.description}
                      </p>

                      {selectedSource === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-700 pt-4 mt-auto"
                        >
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                            Инструменты:
                          </h4>
                          <ul className="space-y-1 mb-4">
                            {source.tools.map((tool, i) => (
                              <li key={i} className="text-xs text-slate-300">
                                • {tool}
                              </li>
                            ))}
                          </ul>

                          <h4 className="text-sm font-semibold text-purple-400 mb-2">
                            Стратегия:
                          </h4>
                          <p className="text-xs text-slate-300 mb-3">
                            {source.strategy}
                          </p>

                          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg p-3">
                            <p className="text-xs text-cyan-400 font-semibold">
                              Конверсия: {source.conversion}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Идеальный профиль клиента
              </h2>
              <p className="text-slate-400">
                Квалифицируйте лид перед началом работы
              </p>
            </motion.div>

            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-8">
                <div className="space-y-6">
                  {idealClient.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {item.criteria}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Система квалификации BANT
              </h2>
              <p className="text-slate-400">
                Оцените качество лида по 4 критериям
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {bant.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 h-full">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">{item.letter}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {item.title}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                            Вопросы:
                          </h4>
                          <ul className="space-y-2">
                            {item.questions.map((q, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-cyan-400 font-bold">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-lg p-3">
                          <p className="text-xs text-purple-400 font-semibold mb-1">
                            Оценка:
                          </p>
                          <p className="text-xs text-slate-300">
                            {item.score}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Реальные кейсы
              </h2>
              <p className="text-slate-400">
                Как работают стратегии на практике
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {cases.map((caseItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 h-full">
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${caseItem.color} flex items-center justify-center mb-4`}>
                        <Icon name={caseItem.icon} size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        {caseItem.title}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-cyan-400 mb-1 uppercase">
                            Ситуация
                          </h4>
                          <p className="text-sm text-slate-300">
                            {caseItem.situation}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-purple-400 mb-1 uppercase">
                            Действия
                          </h4>
                          <ul className="space-y-1">
                            {caseItem.actions.map((action, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-purple-400 font-bold">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-blue-400 mb-1 uppercase">
                            Результат
                          </h4>
                          <p className="text-sm text-slate-300">
                            {caseItem.result}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3">
                          <p className="text-xs text-cyan-400 font-semibold">
                            {caseItem.metrics}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Типичные ошибки
              </h2>
              <p className="text-slate-400">
                Чего НЕ делать при поиске клиентов
              </p>
            </motion.div>

            <div className="space-y-4">
              {mistakes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <Icon name="X" size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">
                            ❌ {item.mistake}
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">
                            Почему плохо: {item.why}
                          </p>
                          <div className="flex items-start gap-2 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3">
                            <Icon name="CheckCircle" size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-cyan-400 font-semibold">
                              {item.correct}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
