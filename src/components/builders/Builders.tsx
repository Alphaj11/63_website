'use client';
import { BuilderShell } from './BuilderShell';
import { TacosScene, type TacosPhase } from '@/components/food/TacosScene';
import { KebabScene, type KebabPhase } from '@/components/food/KebabScene';
import { KumpirScene, type KumpirPhase } from '@/components/food/KumpirScene';
import { PlateScene, type PlatePhase } from '@/components/food/PlateScene';
import { builders } from '@/data/menu';

export function TacosBuilder() {
  return (
    <BuilderShell config={builders.tacos} finale={['fold', 'grill']}
      finaleLabels={{ fold: { fr: 'On replie…', en: 'Folding…' }, grill: { fr: 'Passage au grill…', en: 'On the grill…' } }}
      renderScene={({ sel, phase, onPhaseEnd }) => (
        <TacosScene config={builders.tacos} sel={sel} phase={phase as TacosPhase} onPhaseEnd={onPhaseEnd as (p: TacosPhase) => void} />
      )} />
  );
}

export function KebabBuilder() {
  return (
    <BuilderShell config={builders.kebab} finale={['close']} aspect="aspect-[600/440]"
      finaleLabels={{ close: { fr: 'On referme…', en: 'Closing it up…' } }}
      renderScene={({ sel, phase, onPhaseEnd }) => (
        <KebabScene config={builders.kebab} sel={sel} phase={phase as KebabPhase} onPhaseEnd={onPhaseEnd as (p: KebabPhase) => void} />
      )} />
  );
}

export function KumpirBuilder() {
  return (
    <BuilderShell config={builders.kumpir} finale={['serve']} aspect="aspect-[600/440]"
      finaleLabels={{ serve: { fr: 'Dressage…', en: 'Plating…' } }}
      renderScene={({ sel, phase, onPhaseEnd }) => (
        <KumpirScene config={builders.kumpir} sel={sel} phase={phase as KumpirPhase} onPhaseEnd={onPhaseEnd as (p: KumpirPhase) => void} />
      )} />
  );
}

export function PlateBuilder() {
  return (
    <BuilderShell config={builders.assiette} finale={['serve']}
      finaleLabels={{ serve: { fr: 'Dressage…', en: 'Plating…' } }}
      renderScene={({ sel, phase, onPhaseEnd }) => (
        <PlateScene config={builders.assiette} sel={sel} phase={phase as PlatePhase} onPhaseEnd={onPhaseEnd as (p: PlatePhase) => void} />
      )} />
  );
}
