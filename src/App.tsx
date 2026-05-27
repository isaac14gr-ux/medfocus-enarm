import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Award, 
  Brain, 
  Clock, 
  Search, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Zap, 
  Check, 
  ShieldAlert, 
  BookOpen, 
  HelpCircle,
  Volume2,
  Heart,
  Droplet,
  Activity,
  Sparkles,
  ChevronLeft,
  Trophy
} from 'lucide-react';

interface Flashcard {
  id: number;
  category: string;
  title: string;
  question: string;
  answer: string;
  details: string;
  pearl: string;
}

interface Option {
  key: string;
  text: string;
  correct: boolean;
}

interface Quiz {
  id: number;
  topic: string;
  vignette: string;
  options: Option[];
  explanation: string;
}

interface Drug {
  name: string;
  dose: string;
  duration: string;
}

interface Machete {
  disease: string;
  specialty: string;
  diagnosis: string;
  drugs: Drug[];
  pearl: string;
}

const MEDICINE_DATABASE = {
  flashcards: [
    {
      id: 1,
      category: "Urgencias / Choque",
      title: "Choque Anafiláctico",
      question: "¿Cuál es el fármaco de primera línea, su dosis, vía y sitio de administración?",
      answer: "Adrenalina 1:1000",
      details: "Dosis: 0.3 a 0.5 mg (0.3 - 0.5 mL) IM en cara anterolateral del muslo (vasto lateral). Se puede repetir cada 5 a 15 minutos en caso de no respuesta.",
      pearl: "GPC: La vía subcutánea NO se recomienda debido a absorción tardía en estado de choque."
    },
    {
      id: 2,
      category: "Urgencias / Endocrino",
      title: "Cetoacidosis Diabética (CAD)",
      question: "¿Cuál es el esquema de insulinoterapia inicial y meta de reducción de glucosa?",
      answer: "Insulina Rápida IV",
      details: "Bolo inicial: 0.1 UI/kg IV, seguido de infusión continua a 0.1 UI/kg/h (o 0.14 UI/kg/h de infusión directa sin bolo). Meta: Disminuir glucosa de 50 a 75 mg/dL por hora.",
      pearl: "GPC: Si el potasio sérico es < 3.3 mEq/L, NO iniciar insulina hasta corregir K por encima de ese nivel."
    },
    {
      id: 3,
      category: "Medicina Interna / Infecto",
      title: "Neumonía Adquirida en Comunidad (Manejo Ambulatorio - CURB-65: 0-1)",
      question: "¿Tratamiento de elección según GPC, dosis y duración estándar?",
      answer: "Amoxicilina (Primera elección)",
      details: "Amoxicilina 1 g vía oral cada 8 horas durante 5 a 7 días. Alternativa en alergia o comórbidos: Levofloxacino 750 mg VO cada 24 horas por 5 días.",
      pearl: "ENARM: El CURB-65 define el sitio de manejo. Confusión (1), Urea > 19 (1), FR >= 30 (1), PAS <90 o PAD <=60 (1), Edad >=65 (1)."
    },
    {
      id: 4,
      category: "Medicina Interna / Cardio",
      title: "Crisis Hipertensiva - Emergencia (Dissección Aórtica)",
      question: "¿Cuál es el fármaco de elección, meta de presión y tiempo?",
      answer: "Esmolol o Labetalol IV + Nitroprusiato",
      details: "Esmolol: Bolo 500 mcg/kg en 1 min, infusión 50 mcg/kg/min. Meta: Bajar PAS rápidamente a < 120 mmHg y FC < 60 lpm en los primeros 10-20 minutos.",
      pearl: "Urgencias: La disección aórtica es la única emergencia hipertensiva donde se baja la presión de forma abrupta e inmediata."
    },
    {
      id: 5,
      category: "Urgencias / Toxicología",
      title: "Intoxicación por Paracetamol",
      question: "¿Fármaco antídoto, dosis de carga y esquema de mantenimiento?",
      answer: "N-Acetilcisteína (NAC)",
      details: "Esquema oral (18 dosis): Carga de 140 mg/kg, seguida de 70 mg/kg cada 4 horas por 17 dosis más. Esquema IV (protocolo de 21 horas): Carga de 150 mg/kg en 1 hora, luego 50 mg/kg in 4 horas y 100 mg/kg en 16 horas.",
      pearl: "ENARM: Utilizar el normograma de Rumack-Matthew para decidir tratamiento a partir de las 4 horas de la ingesta."
    }
  ] as Flashcard[],
  
  quizzes: [
    {
      id: 201,
      topic: "Endocrinología",
      vignette: "Femenina de 65 años con antecedente de DM2 de larga evolución acude por somnolencia, deshidratación de mucosas severa y letargia. Laboratorios: Glucosa 620 mg/dL, pH arterial 7.35, HCO3 22 mEq/L, osmolaridad sérica efectiva de 335 mOsm/kg. ¿Cuál es la primera medida terapéutica de elección según la GPC?",
      options: [
        { key: "A", text: "Iniciar infusión de Insulina rápida a 0.1 UI/kg/h", correct: false },
        { key: "B", text: "Hidratación inicial con Solución Salina al 0.9% (15-20 mL/kg/h)", correct: true },
        { key: "C", text: "Administrar bicarbonato de sodio a dosis de 100 mEq", correct: false },
        { key: "D", text: "Iniciar infusión de potasio a 40 mEq/h independientemente de sus niveles", correct: false }
      ],
      explanation: "El cuadro clínico y laboratorios integran un Estado Hiperosmolar Hiperglucémico (EHH). El paso terapéutico primario es la reposición intensiva de líquidos para restaurar el volumen intravascular y disminuir la osmolaridad sérica. La insulinoterapia se inicia una vez que se ha corregido el volumen circulante."
    },
    {
      id: 202,
      topic: "Cardiología",
      vignette: "Paciente masculino de 58 años acude por dolor torácico transfictivo e intenso, de inicio súbito, irradiado a región interescapular. Cuenta con antecedente de hipertensión arterial descontrolada. Signos vitales: PA 190/115 mmHg, FC 110 lpm. ¿Cuál es la meta prioritaria de Presión Arterial Sistólica (PAS) y frecuencia cardíaca que se debe lograr en los primeros 20 minutos según la GPC?",
      options: [
        { key: "A", text: "PAS < 140 mmHg y FC < 80 lpm", correct: false },
        { key: "B", text: "PAS < 120 mmHg y FC < 60 lpm", correct: true },
        { key: "C", text: "PAS < 160 mmHg y FC < 90 lpm", correct: false },
        { key: "D", text: "Descenso de la presión arterial media no mayor al 25% del basal", correct: false }
      ],
      explanation: "El cuadro es altamente sugestivo de una disección aórtica aguda (una emergencia hipertensiva). A diferencia de otras crisis hipertensivas, la disección aórtica requiere un descenso rápido y agresivo de la PAS < 120 mmHg y FC < 60 lpm con beta-bloqueadores de acción corta (ej. Esmolol o Labetalol) para disminuir la fuerza de cizallamiento sobre la pared aórtica."
    },
    {
      id: 203,
      topic: "Infectología",
      vignette: "Masculino de 45 años ingresa a urgencias por sospecha de foco infeccioso abdominal. Signos vitales: FR 24 rpm, PAS 85 mmHg (refractaria a líquidos), alteración del estado mental, temperatura 38.9 °C. ¿Cuántos criterios del score qSOFA (Quick SOFA) cumple y qué sospecha diagnóstica prioritaria se integra?",
      options: [
        { key: "A", text: "1 criterio; requiere únicamente manejo antibiótico ambulatorio", correct: false },
        { key: "B", text: "3 criterios; sospecha clínica de Sepsis / Choque Séptico", correct: true },
        { key: "C", text: "2 criterios; requiere internamiento únicamente para observación simple", correct: false },
        { key: "D", text: "0 criterios; el paciente cursa con Síndrome de Respuesta Inflamatoria Sistémica no infeccioso", correct: false }
      ],
      explanation: "El score qSOFA evalúa: 1) Alteración mental (1 punto), 2) FR >= 22 rpm (1 punto), 3) PAS <= 100 mmHg (1 punto). El paciente cumple con los 3 criterios (puntuación >= 2 indica alta sospecha de sepsis e incrementa la mortalidad intrahospitalaria), requiriendo iniciar de inmediato reanimación hídrica agresiva a 30 mL/kg e inicio temprano de vasopresores."
    }
  ] as Quiz[],

  machetes: [
    {
      disease: "Cetoacidosis Diabética (CAD)",
      specialty: "Urgencias / Endocrino",
      diagnosis: "Glucosa >250 mg/dL, pH <7.30, HCO3 <18 mEq/L, Anion Gap >10-12, Cetonas positivas.",
      drugs: [
        { name: "Solución Salina 0.9%", dose: "1000 - 1500 mL en la primera hora", duration: "Según estado de hidratación" },
        { name: "Insulina Rápida", dose: "Bolo 0.1 UI/kg, luego infusión continua a 0.1 UI/kg/h", duration: "Hasta cierre de brecha aniónica" }
      ],
      pearl: "No suspender infusión de insulina hasta iniciar insulina basal SC (traslape de 1 a 2 horas)."
    }
  ] as Machete[]
};

const QUIZ_TOPICS = [
  { id: "Endocrinología", name: "Endocrinología", icon: Droplet, color: "from-rose-500/20 to-red-950/40 border-rose-500/30 text-rose-400" },
  { id: "Cardiología", name: "Cardiología", icon: Heart, color: "from-red-500/20 to-rose-950/40 border-red-500/30 text-red-400" },
  { id: "Infectología", name: "Infectología", icon: Activity, color: "from-emerald-500/20 to-teal-950/40 border-emerald-500/30 text-emerald-400" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flashcards' | 'quiz' | 'machetes' | 'timer'>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(3);
  const [level, setLevel] = useState(1);
  const [customAlert, setCustomAlert] = useState<string | null>(null);

  // Flashcards
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showSummaryScreen, setShowSummaryScreen] = useState(false);

  // Machetes Search
  const [searchTerm, setSearchTerm] = useState('');

  // ADHD Pomodoro Timer
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins for ADHD
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const calculatedLevel = Math.floor(xp / 100) + 1;
    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      triggerToast(`¡Subiste al Nivel ${calculatedLevel}! 🎉`);
    }
  }, [xp, level]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timerType]);

  const triggerToast = (msg: string) => {
    setCustomAlert(msg);
    setTimeout(() => setCustomAlert(null), 4000);
  };

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignorar fallas de reproducción en navegadores sin interaccion previa
    }
  };

  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
    playSound();
  };

  const handleTimerComplete = () => {
    if (timerType === 'focus') {
      addXP(50);
      setTimerType('break');
      setTimerSeconds(180); // 3 mins break
      triggerToast("¡Sesión completada! +50 XP. Descansa 3 min.");
    } else {
      setTimerType('focus');
      setTimerSeconds(900); // 15 mins focus
      triggerToast("¡Descanso terminado! Hora de enfocarse.");
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredQuizzes = selectedTopic 
    ? MEDICINE_DATABASE.quizzes.filter(q => q.topic === selectedTopic)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-12">
      {customAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-extrabold px-6 py-3 rounded-2xl shadow-xl border border-emerald-400 animate-bounce flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {customAlert}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950 px-4 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">MedFocus <span className="text-emerald-400 text-xs px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">TS PRO</span></h1>
              <p className="text-[10px] text-slate-400">Enfoque médico activo sin distractores</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
              <Flame className="h-3.5 w-3.5 fill-amber-400" />
              <span>{streak} días</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-xs font-semibold">
              <span className="text-slate-400">Nivel {level}</span>
              <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${xp % 100}%` }} />
              </div>
              <span className="text-emerald-400 font-extrabold">{xp} XP</span>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border ${soundEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-5">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto gap-0.5">
          {(['dashboard', 'flashcards', 'quiz', 'machetes', 'timer'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setIsFlipped(false); }}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all whitespace-nowrap capitalize flex items-center justify-center gap-1.5 ${
                activeTab === tab ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'dashboard' && <Activity className="h-3.5 w-3.5" />}
              {tab === 'flashcards' && <Zap className="h-3.5 w-3.5" />}
              {tab === 'quiz' && <BookOpen className="h-3.5 w-3.5" />}
              {tab === 'machetes' && <Search className="h-3.5 w-3.5" />}
              {tab === 'timer' && <Clock className="h-3.5 w-3.5" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-slate-950 p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">Hiperenfoque Activo</span>
                <h2 className="text-xl md:text-2xl font-extrabold mt-3 text-white">¿Listos para derrotar al ENARM?</h2>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed max-w-lg">
                  Metodología optimizada para cerebros hiperactivos. Sprints cortos de 15 minutos, sin teoría redundante, directo a los criterios diagnósticos y dosis exactas de la GPC.
                </p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setActiveTab('quiz')} className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-400/10">
                    Iniciar Test Temático <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-400">Tip TDAH del día</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Divide tu estudio en fases pequeñas. No intentes abarcar todo el simulador hoy. Con que realices un módulo de 3 casos, es suficiente para mantener activa tu memoria a largo plazo.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-3">
                  <Award className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-emerald-400">Logros del Sistema</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      Sube de nivel sumando puntos de XP. Cada respuesta correcta te otorga un impulso de dopamina mediante retroalimentación táctil y auditiva.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="max-w-md mx-auto space-y-4 animate-fadeIn">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[220px] cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between ${
                  isFlipped ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {!isFlipped ? (
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-extrabold uppercase">
                        {MEDICINE_DATABASE.flashcards[currentCardIndex].category}
                      </span>
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <div className="text-center py-4">
                      <h3 className="text-base font-extrabold text-white">
                        {MEDICINE_DATABASE.flashcards[currentCardIndex].title}
                      </h3>
                      <p className="text-xs text-slate-300 italic mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                        "{MEDICINE_DATABASE.flashcards[currentCardIndex].question}"
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 text-center animate-pulse">Toca la tarjeta para ver respuesta y dosis exacta</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest block">Respuesta de la GPC</span>
                    <h3 className="text-md font-extrabold text-white">
                      {MEDICINE_DATABASE.flashcards[currentCardIndex].answer}
                    </h3>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {MEDICINE_DATABASE.flashcards[currentCardIndex].details}
                    </p>
                    <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 flex gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-300">
                        <strong>Perla:</strong> {MEDICINE_DATABASE.flashcards[currentCardIndex].pearl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isFlipped && (
                <div className="flex gap-2 justify-center animate-slideUp">
                  <button 
                    onClick={() => {
                      addXP(15);
                      setIsFlipped(false);
                      triggerToast("¡Bien memorizado! +15 XP");
                      setCurrentCardIndex(p => (p + 1) % MEDICINE_DATABASE.flashcards.length);
                    }}
                    className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Lo dominé
                  </button>
                  <button 
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex(p => (p + 1) % MEDICINE_DATABASE.flashcards.length);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-xl"
                  >
                    Siguiente tarjeta
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
              {!selectedTopic ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <h2 className="text-lg font-extrabold">Selecciona Especialidad de Estudio</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Elige un módulo temático corto para concentrar tu atención</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {QUIZ_TOPICS.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic.id);
                          setCurrentQuizIndex(0);
                          setSelectedOption(null);
                          setQuizSubmitted(false);
                          setQuizScore(0);
                          setShowSummaryScreen(false);
                        }}
                        className={`bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl text-left hover:scale-[1.01] transition-all flex flex-col justify-between h-32`}
                      >
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-emerald-400 self-start">
                          <Brain className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold text-white block">{topic.name}</h3>
                          <span className="text-[10px] text-slate-400 mt-0.5">Casos Clínicos GPC</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : !showSummaryScreen ? (
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">{selectedTopic}</span>
                    <span className="text-[10px] text-slate-500 font-bold">Caso {currentQuizIndex + 1} de {filteredQuizzes.length}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-850 font-medium">
                    {filteredQuizzes[currentQuizIndex].vignette}
                  </p>

                  <div className="space-y-2">
                    {filteredQuizzes[currentQuizIndex].options.map(opt => {
                      let style = "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-850/30";
                      if (quizSubmitted) {
                        if (opt.correct) style = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                        else if (selectedOption === opt.key) style = "bg-rose-500/10 border-rose-500 text-rose-400 font-bold";
                        else style = "bg-slate-950/40 border-slate-950 text-slate-600";
                      } else if (selectedOption === opt.key) {
                        style = "bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold";
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedOption(opt.key)}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between ${style}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px]">{opt.key}</span>
                            <span>{opt.text}</span>
                          </span>
                          {quizSubmitted && opt.correct && <Check className="h-4 w-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => {
                          if (!selectedOption) return;
                          setQuizSubmitted(true);
                          const correct = filteredQuizzes[currentQuizIndex].options.find(o => o.correct)?.key;
                          if (selectedOption === correct) {
                            addXP(30);
                            setQuizScore(p => p + 1);
                          }
                        }}
                        className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        Validar Respuesta
                      </button>
                    ) : (
                      <div className="w-full space-y-3">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] leading-relaxed">
                          <strong className="text-emerald-400 text-[10px] uppercase block mb-1">Perla del Caso:</strong>
                          <p className="text-slate-300">{filteredQuizzes[currentQuizIndex].explanation}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOption(null);
                            setQuizSubmitted(false);
                            if (currentQuizIndex + 1 < filteredQuizzes.length) {
                              setCurrentQuizIndex(p => p + 1);
                            } else {
                              setShowSummaryScreen(true);
                              addXP(100);
                            }
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center"
                        >
                          {currentQuizIndex + 1 < filteredQuizzes.length ? 'Siguiente Caso' : 'Ver Resultados'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4 max-w-sm mx-auto">
                  <Trophy className="h-10 w-10 text-emerald-400 mx-auto" />
                  <div>
                    <h3 className="text-base font-extrabold text-white">¡Módulo Completado!</h3>
                    <p className="text-xs text-slate-400 mt-1">Suma total de aciertos de especialidad</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <strong className="text-2xl text-emerald-400 font-extrabold block">{quizScore} / {filteredQuizzes.length}</strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Bono de finalización: +100 XP</span>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs py-2.5 rounded-lg"
                  >
                    Regresar al Menú
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Machetes Tab */}
          {activeTab === 'machetes' && (
            <div className="space-y-4 animate-fadeIn">
              <input
                type="text"
                placeholder="Buscar enfermedad en el Machete..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MEDICINE_DATABASE.machetes
                  .filter(m => m.disease.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div>
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">{m.specialty}</span>
                        <h4 className="text-sm font-extrabold text-white mt-1">{m.disease}</h4>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-[10px] font-mono text-slate-300 leading-relaxed">
                        <strong>Dx:</strong> {m.diagnosis}
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Fármacos y dosis estándar</span>
                        {m.drugs.map((d, dIdx) => (
                          <div key={dIdx} className="bg-slate-950 p-2 rounded flex justify-between text-[10px]">
                            <div>
                              <strong className="text-emerald-400 block">{d.name}</strong>
                              <span className="text-slate-300">{d.dose}</span>
                            </div>
                            <span className="text-slate-500 self-center">{d.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Timer Tab */}
          {activeTab === 'timer' && (
            <div className="max-w-xs mx-auto text-center space-y-4 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center">
                <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest font-extrabold">
                  {timerType === 'focus' ? 'Estudio Activo' : 'Descanso'}
                </span>
                <div className="w-40 h-40 rounded-full border-4 border-slate-850 flex items-center justify-center bg-slate-950 my-5">
                  <span className="text-3xl font-black text-white tracking-widest">{formatTime(timerSeconds)}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex-1 py-2.5 rounded-lg font-black text-xs ${
                      isTimerRunning ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {isTimerRunning ? 'Pausar' : 'Empezar sprint'}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(timerType === 'focus' ? 900 : 180);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}