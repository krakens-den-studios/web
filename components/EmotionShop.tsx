'use client';

import { useState } from 'react';
import Button from './Button';
import { RiLockLine, RiEmotionLine } from 'react-icons/ri';

interface Emotion {
  id: string;
  name: string;
  description: string;
  color: string;
  cost: number;
  unlocked: boolean;
  sectionId: string;
}

interface EmotionShopProps {
  emotions: Emotion[];
  collectedOctopuses: number;
  onPurchase: (emotionId: string) => void;
  onClose: () => void;
}

export default function EmotionShop({ emotions, collectedOctopuses, onPurchase, onClose }: EmotionShopProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative bg-turquoise-800 rounded-2xl p-8 md:p-12 max-w-4xl mx-4 border-2 border-turquoise-400 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold opacity-60 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-10"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h2 className="font-lora text-4xl md:text-5xl font-bold text-turquoise-400 mb-4">
            El Tesoro del Kraken
          </h2>
          <div className="flex items-center justify-center gap-3 text-2xl">
            <RiEmotionLine className="text-turquoise-400" />
            <span className="text-white font-bold">{collectedOctopuses}</span>
            <span className="text-white opacity-80">pulpitos recolectados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emotions.map((emotion) => (
            <div
              key={emotion.id}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                emotion.unlocked
                  ? 'bg-turquoise-400 bg-opacity-20 border-turquoise-400'
                  : collectedOctopuses >= emotion.cost
                  ? 'bg-turquoise-800 border-turquoise-400 hover:border-turquoise-300 cursor-pointer'
                  : 'bg-gray-800 border-gray-600 opacity-60'
              }`}
              onClick={() => {
                if (!emotion.unlocked && collectedOctopuses >= emotion.cost) {
                  setSelectedEmotion(emotion);
                }
              }}
            >
              {emotion.unlocked ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-xl">✓</span>
                  <h3 className="font-lora text-2xl font-bold text-white">{emotion.name}</h3>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-lora text-2xl font-bold text-white flex items-center gap-2">
                    {emotion.name} <RiLockLine className="w-5 h-5" />
                  </h3>
                  <div className="flex items-center gap-2">
                    <RiEmotionLine className="text-turquoise-400" />
                    <span className="text-white font-bold">{emotion.cost}</span>
                  </div>
                </div>
              )}

              <p className="text-white opacity-80 text-sm mb-4">{emotion.description}</p>

              {!emotion.unlocked && (
                <div className="text-center">
                  {collectedOctopuses >= emotion.cost ? (
                    <Button
                      label="DESBLOQUEAR"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPurchase(emotion.id);
                      }}
                    />
                  ) : (
                    <p className="text-white opacity-60 text-sm">
                      Necesitas {emotion.cost - collectedOctopuses} pulpitos más
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedEmotion && !selectedEmotion.unlocked && (
          <div className="mt-6 p-4 bg-turquoise-400 bg-opacity-20 rounded-lg border border-turquoise-400">
            <p className="text-white text-center">
              ¿Deseas desbloquear <span className="font-bold">{selectedEmotion.name}</span> por{' '}
              <span className="font-bold">{selectedEmotion.cost} pulpitos</span>?
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button
                label="CONFIRMAR"
                onClick={() => {
                  onPurchase(selectedEmotion.id);
                  setSelectedEmotion(null);
                }}
              />
              <button
                onClick={() => setSelectedEmotion(null)}
                className="text-white text-lg font-lora opacity-60 hover:opacity-100 transition-opacity underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

