import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const vacanciesData = [
  {
    name: 'Помощник бурильщика',
    salary: 'Обсуждается по факту',
    category: 'Рабочие',
    functions: 'Выполнение работ по бурению под руководством бурильщика, обслуживание и текущий ремонт бурового оборудования, ведение документации. Точный перечень обязанностей будет предоставлен руководителем отдела.',
    age: '25-45',
    education: 'Среднее профессиональное (по профилю)',
    experience: 'От 3 лет',
    requirements: 'Опыт работы на буровых. Навыки обслуживания ДВС и техники. Права категории В, С (желательно).'
  },
  {
    name: 'Машинист буровой установки',
    salary: 'Обсуждается по факту',
    category: 'Рабочие',
    functions: 'Управление буровой установкой, проведение буровых работ, техническое обслуживание и диагностика оборудования, руководство помощником бурильщика.',
    age: '30-55',
    education: 'Среднее профессиональное (по профилю)',
    experience: 'От 3 лет',
    requirements: 'Опыт работы на буровых установках в разных регионах. Навыки ТО и ремонта. Права категории В, С.'
  },
  {
    name: 'Водитель автомобиля с КМУ',
    salary: 'Обсуждается по факту',
    category: 'Рабочие',
    functions: 'Управление автомобилем с КМУ, выполнение погрузочно-разгрузочных и такелажных работ на объекте, техническое обслуживание транспортного средства и кранового оборудования.',
    age: '25-45',
    education: 'Среднее профессиональное',
    experience: 'От 3 лет',
    requirements: 'Водительские права категории В, С. Действующее удостоверение крановщика (машиниста крана). Опыт работы с КМУ.'
  },
  {
    name: 'Мастер участка бурения',
    salary: 'Обсуждается по факту',
    category: 'Руководители',
    functions: 'Организация и контроль буровых работ на участке, ведение производственной документации и сменных отчетов, планирование работ, управление персоналом (до 15 чел.), взаимодействие со смежными службами.',
    age: '35-60',
    education: 'Высшее (предпочтительно) или среднее профессиональное',
    experience: 'От 5 лет',
    requirements: 'Опыт руководства бригадой/участком. Уверенный ПК (Word, Excel, электронная почта). Права категории В (кат. С – желательно). Навыки работы с геодезическим оборудованием (нивелир).'
  },
  {
    name: 'Инженер по технике безопасности (ТБ)',
    salary: '220 000 – 250 000 ₽',
    salaryDetails: 'Оклад: 50 000 ₽ + Премиальная часть: 170 000 – 200 000 ₽',
    category: 'Специалисты',
    functions: 'Контроль за соблюдением норм и правил охраны труда и промышленной безопасности на объектах бурения, проведение инструктажей, расследование инцидентов, ведение документации по ТБ.',
    special: 'Командировочный график: выезд на объект по требованию на 1-2 недели с последующим возвращением к месту постоянного проживания.',
    age: '35-60',
    education: 'Высшее (техническое, по ТБ)',
    experience: 'От 5 лет',
    requirements: 'Действующий диплом/сертификат специалиста по ОТ и ПБ. Опыт в строительстве/бурении. Права категории В.'
  },
  {
    name: 'Инженер-геодезист',
    salary: '200 000 – 220 000 ₽',
    salaryDetails: 'Оклад: 50 000 ₽ + Премиальная часть: 150 000 – 170 000 ₽',
    category: 'Специалисты',
    functions: 'Геодезическое сопровождение буровых работ, выполнение съемок, разбивочные работы, обработка данных, подготовка исполнительной документации.',
    age: '25-45',
    education: 'Высшее (геодезия, прикладная геодезия)',
    experience: 'От 5 лет',
    requirements: 'Опыт геодезического сопровождения строительства/бурения. Навык работы с современным геодезическим оборудованием и ПО. Права категории В.'
  }
];

const TEC = () => {
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
  const [animateCards, setAnimateCards] = useState(false);

  useState(() => {
    setTimeout(() => setAnimateCards(true), 100);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      <header className="border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse">
                <Icon name="Building2" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Заявка на подбор персонала
                </h1>
                <p className="text-cyan-400/80 text-sm mt-1">Дата составления: 19.01.2026</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-xl">Причина возникновения вакансии</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-lg">Расширение фронта работ, формирование новой вахты.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-cyan-500/30">
            <TabsTrigger value="info">Общая информация</TabsTrigger>
            <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
            <TabsTrigger value="requirements">Требования к кандидатам</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">1. Общая информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="MapPin" size={18} />
                      Локация проекта / Адрес места работы
                    </p>
                    <p className="text-slate-300 text-sm">
                      Республика Саха (Якутия), Нерюнгринский район, г. Чульман, площадка Южно-Якутской ТЭС. 
                      В дальнейшем – возможны командировки на другие объекты проекта.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Building" size={18} />
                      Отдел
                    </p>
                    <p className="text-slate-300 text-sm">Бурение</p>
                  </div>

                  <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                    <p className="text-violet-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="User" size={18} />
                      Руководитель (непосредственное подчинение)
                    </p>
                    <p className="text-slate-300 text-sm">Швалагин Иван Иванович</p>
                  </div>

                  <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Calendar" size={18} />
                      График работы
                    </p>
                    <p className="text-slate-300 text-sm">
                      Вахтовый метод. Режим: 2 месяца на объекте / 1 месяц отдых.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Clock" size={18} />
                      Испытательный срок
                    </p>
                    <p className="text-slate-300 text-sm">3 месяца</p>
                  </div>

                  <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                    <p className="text-violet-400 font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Plane" size={18} />
                      Командировки
                    </p>
                    <p className="text-slate-300 text-sm">
                      Возможны периодические командировки на другие объекты проекта по требованию руководства.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">4. Перспективы и дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Users" size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-cyan-400 font-semibold mb-1">Источники кандидатов</p>
                      <p className="text-slate-300 text-sm">
                        Приветствуются кандидаты из крупных строительных и буровых компаний.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="TrendingUp" size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-purple-400 font-semibold mb-1">Перспективы роста</p>
                      <p className="text-slate-300 text-sm">
                        Возможность повышения квалификации и карьерного роста в рамках проекта и компании 
                        (например, переход на позиции старшего мастера, ведущего инженера).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Package" size={20} className="text-violet-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-violet-400 font-semibold mb-1">Оборудование/рабочее место</p>
                      <p className="text-slate-300 text-sm">
                        Обеспечивается компанией на месте работы.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-cyan-400 font-semibold mb-1">Комментарий для рекрутера</p>
                      <p className="text-slate-300 text-sm">
                        Точные должностные инструкции по каждой позиции необходимо запросить у руководителя отдела – 
                        Ивана Ивановича Швалагина.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cyan-500/20 pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Составил</p>
                    <p className="text-cyan-400 font-semibold">Козлов Евгений Владимирович</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Согласовано (Руководитель заказчика)</p>
                    <p className="text-purple-400 font-semibold">Швалагин И.И.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacancies" className="space-y-4">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">2. Перечень вакансий и ключевые условия</CardTitle>
                <CardDescription className="text-slate-400">
                  Для всех вакансий выплата премиальной части зависит от выполнения производственных планов, показателей участка и личной эффективности сотрудника.
                </CardDescription>
              </CardHeader>
            </Card>

            {vacanciesData.map((vacancy, idx) => (
              <Card
                key={idx}
                className={`bg-slate-900/50 border-cyan-500/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] ${
                  selectedVacancy === idx ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setSelectedVacancy(selectedVacancy === idx ? null : idx)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                        <Icon name="Briefcase" size={24} className="text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-cyan-400">Вакансия {idx + 1}: {vacancy.name}</CardTitle>
                        <CardDescription className="text-slate-400">{vacancy.category}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-400">{vacancy.salary}</p>
                      {vacancy.salaryDetails && (
                        <p className="text-xs text-slate-400 mt-1">{vacancy.salaryDetails}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {selectedVacancy === idx && (
                  <CardContent className="border-t border-cyan-500/20 pt-4 space-y-4">
                    <div>
                      <p className="text-cyan-400 font-semibold mb-2">Функции:</p>
                      <p className="text-slate-300 text-sm">{vacancy.functions}</p>
                    </div>
                    
                    {vacancy.special && (
                      <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                        <p className="text-violet-400 font-semibold mb-1">Особые условия:</p>
                        <p className="text-slate-300 text-sm">{vacancy.special}</p>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="text-purple-400 font-semibold mb-1">Премия:</p>
                      <p className="text-slate-300 text-sm">
                        Зависит от выполнения производственных планов и показателей участка.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-cyan-500/10">
                      <div>
                        <p className="text-slate-400">Возраст:</p>
                        <p className="text-cyan-400">{vacancy.age}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Опыт работы:</p>
                        <p className="text-cyan-400">{vacancy.experience}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-400">Образование:</p>
                        <p className="text-cyan-400">{vacancy.education}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-400">Обязательные навыки и документы:</p>
                        <p className="text-cyan-400">{vacancy.requirements}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">3. Требования к кандидатам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Общие для всех вакансий требования:</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Heart" size={18} />
                        Личностные качества
                      </p>
                      <p className="text-slate-300 text-sm">
                        Ответственность, исполнительность, коммуникабельность, стрессоустойчивость, умение работать в команде. 
                        <span className="text-cyan-400 font-semibold"> Обязательное условие – трезвый образ жизни.</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Activity" size={18} />
                        Здоровье
                      </p>
                      <p className="text-slate-300 text-sm">
                        Кандидаты должны обладать крепким здоровьем, пригодным для работы в условиях Крайнего Севера. 
                        Все кандидаты проходят обязательную предварительную медицинскую комиссию под нашим контролем, 
                        включая освидетельствование у нарколога, психиатра, проверку на отсутствие гипертонической болезни.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                      <p className="text-pink-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Shield" size={18} />
                        Безопасность
                      </p>
                      <p className="text-slate-300 text-sm">
                        Отсутствие неснятых или непогашенных судимостей. 
                        <span className="text-pink-400 font-semibold"> Внимание:</span> не рассматриваем кандидатов с опытом работы 
                        на "новых территориях" (в соответствии с требованиями законодательства и политики компании).
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Star" size={18} />
                        Желательный опыт
                      </p>
                      <p className="text-slate-300 text-sm">
                        Опыт работы в регионах Крайнего Севера, Дальнего Востока или на других сложных, 
                        удаленных объектах промышленного строительства.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">Специфические требования по вакансиям:</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-cyan-500/20">
                          <th className="text-left p-3 text-cyan-400">Должность</th>
                          <th className="text-left p-3 text-cyan-400">Возраст</th>
                          <th className="text-left p-3 text-cyan-400">Образование</th>
                          <th className="text-left p-3 text-cyan-400">Опыт работы</th>
                          <th className="text-left p-3 text-cyan-400">Обязательные навыки и документы</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vacanciesData.map((vacancy, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50 hover:bg-cyan-500/5">
                            <td className="p-3 text-slate-300">{vacancy.name}</td>
                            <td className="p-3 text-slate-300">{vacancy.age}</td>
                            <td className="p-3 text-slate-300">{vacancy.education}</td>
                            <td className="p-3 text-slate-300">{vacancy.experience}</td>
                            <td className="p-3 text-slate-300">{vacancy.requirements}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p className="text-sm">
            Заявка на подбор персонала • Южно-Якутская ТЭС • 19.01.2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TEC;