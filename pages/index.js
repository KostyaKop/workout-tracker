import React, { useState, useMemo } from 'react';
import { Timer, Plus, Save, Search, Check, ChevronDown, ChevronUp } from 'lucide-react';

// Демо дані
const exercises = [
  { id: '1', name: 'Жим лежачи', group: 'груди', lastWeight: 60 },
  { id: '2', name: 'Присідання', group: 'ноги', lastWeight: 80 },
  { id: '3', name: 'Станова тяга', group: 'спина', lastWeight: 100 },
  { id: '4', name: 'Жим гантелей', group: 'плечі', lastWeight: 20 },
  { id: '5', name: 'Тяга верхнього блоку', group: 'спина', lastWeight: 55 }
];

// Заплановані вправи на це тренування
const plannedExercises = [
  { id: '1', name: 'Жим лежачи', group: 'груди', sets: 4, targetWeight: 62.5 },
  { id: '3', name: 'Станова тяга', group: 'спина', sets: 3, targetWeight: 100 },
  { id: '4', name: 'Жим гантелей', group: 'плечі', sets: 4, targetWeight: 22.5 }
];

const WorkoutTrackerDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanned, setShowPlanned] = useState(true);
  const [activeExercises, setActiveExercises] = useState([
    {
      exercise: exercises[0],
      sets: [
        { weight: 60, reps: 10 },
        { weight: 65, reps: 8 }
      ]
    }
  ]);
  const [timer, setTimer] = useState("00:15:30");

  // Фільтрація вправ для пошуку
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.group.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Перевірка чи вправа вже додана
  const isExerciseActive = (exerciseId) => {
    return activeExercises.some(ae => ae.exercise.id === exerciseId);
  };

  // Додавання нової вправи
  const addExercise = (exercise) => {
    if (!isExerciseActive(exercise.id)) {
      setActiveExercises([...activeExercises, {
        exercise,
        sets: [{ weight: exercise.lastWeight, reps: 0 }]
      }]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Верхня панель */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Нове тренування</h1>
            <p className="text-gray-500">6 січня 2025</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-2xl font-mono bg-gray-100 px-4 py-2 rounded">
              {timer}
            </div>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Timer size={20} />
              <span>Старт</span>
            </button>
          </div>
        </div>
      </div>

      {/* Заплановані вправи */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4 cursor-pointer" 
             onClick={() => setShowPlanned(!showPlanned)}>
          <h2 className="text-lg font-semibold">Заплановані вправи</h2>
          {showPlanned ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {showPlanned && (
          <div className="space-y-3">
            {plannedExercises.map(exercise => (
              <div key={exercise.id} 
                   className={`p-3 rounded-lg border ${
                     isExerciseActive(exercise.id) ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                   }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-500">
                      {exercise.sets} підходів × {exercise.targetWeight} кг
                    </div>
                  </div>
                  {isExerciseActive(exercise.id) ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <button 
                      onClick={() => addExercise(exercises.find(e => e.id === exercise.id))}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Пошук вправ */}
      <div className="p-6 border-b">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук вправ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
        </div>
        
        {searchTerm && (
          <div className="mt-2 max-h-60 overflow-y-auto border rounded">
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
                className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => addExercise(exercise)}
              >
                <div>
                  <div>{exercise.name}</div>
                  <div className="text-sm text-gray-500">{exercise.group}</div>
                </div>
                {!isExerciseActive(exercise.id) && <Plus size={16} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Активні вправи */}
      <div className="p-6 space-y-6">
        {activeExercises.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">{item.exercise.name}</h3>
                <p className="text-sm text-gray-500">
                  Останній результат: {item.exercise.lastWeight} кг
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {item.sets.map((set, setIndex) => (
                <div key={setIndex} className="space-y-2">
                  <input
                    type="number"
                    value={set.weight}
                    className="w-full p-2 border rounded text-center"
                    placeholder="кг"
                  />
                  <input
                    type="number"
                    value={set.reps}
                    className="w-full p-2 border rounded text-center"
                    placeholder="повт."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка збереження */}
      <div className="p-6 border-t">
        <button className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600">
          <Save size={20} />
          <span>Зберегти тренування</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutTrackerDemo;
