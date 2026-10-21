import { useId, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  ChevronDown,
  Dumbbell,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/library-filters')({
  component: RouteComponent,
});

type Variant = 'wrapped' | 'scrolling' | 'dropdown' | 'rail' | 'foldaway';
type Sort = 'az' | 'za';
type Exercise = { name: string; muscle: string; equipment: string };
type Comparison = {
  variant: Variant;
  title: string;
  category: string;
  description: string;
  takeaway: string;
};

const workoutName = 'Upper A';
const muscles = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs'];
const initialFavorites = ['Incline dumbbell press', 'Chest-supported row'];
const exercises: Exercise[] = [
  { name: 'Incline dumbbell press', muscle: 'Chest', equipment: 'Dumbbell' },
  { name: 'Cable fly', muscle: 'Chest', equipment: 'Cable' },
  { name: 'Chest-supported row', muscle: 'Back', equipment: 'Dumbbell' },
  { name: 'Lat pulldown', muscle: 'Back', equipment: 'Cable' },
  { name: 'Face pull', muscle: 'Shoulders', equipment: 'Cable' },
  { name: 'Dumbbell curl', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Triceps pushdown', muscle: 'Triceps', equipment: 'Cable' },
  { name: 'Hammer curl', muscle: 'Biceps', equipment: 'Dumbbell' },
  { name: 'Barbell squat', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Romanian deadlift', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Seated leg curl', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Push-up', muscle: 'Chest', equipment: 'Bodyweight' },
];

const comparisons: Comparison[] = [
  {
    variant: 'wrapped',
    title: 'Just the muscle chips',
    category: 'Recommended',
    description: 'Two short rows. Every muscle is visible and one tap away.',
    takeaway: 'The simplest balance: visible choices, very little overhead.',
  },
  {
    variant: 'scrolling',
    title: 'One-line muscle strip',
    category: 'Low profile',
    description: 'One scrolling row keeps more exercises above the fold.',
    takeaway: 'Less height, but you scroll sideways to reach later muscles.',
  },
  {
    variant: 'dropdown',
    title: 'One small dropdown',
    category: 'Minimal',
    description: 'Only one filter to open. Your selected muscles stay visible.',
    takeaway: 'A compact dropdown alternative to the chip-led versions.',
  },
  {
    variant: 'rail',
    title: 'Muscles on the side',
    category: 'Different',
    description: 'A slim muscle rail beside the list. No filter rows above it.',
    takeaway: 'Always accessible, at the cost of narrower exercise rows.',
  },
  {
    variant: 'foldaway',
    title: 'Chips when you need them',
    category: 'In place',
    description: 'A muscle selector unfolds inline. No overlay or Apply step.',
    takeaway: 'More list space by default, one extra tap to see the chips.',
  },
];

function RouteComponent() {
  return (
    <div className="flex h-[calc(100dvh-7.5rem)] min-h-0 min-w-0 flex-col gap-4 p-2 md:h-[calc(100dvh-8.5rem)]">
      <header className="shrink-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          A simpler exercise picker, five ways
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Muscles, search and A–Z. Tap a star to pin an exercise above the rest.
          Favorites still respect your muscle filter and search. Each 300px
          preview is independent; nothing is saved.
        </p>
      </header>
      <ScrollArea
        aria-label="Exercise filter and sort comparisons"
        className="min-h-0 min-w-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:h-full"
      >
        <div className="flex h-full w-max items-stretch gap-6 p-1 pb-5">
          {comparisons.map((comparison, index) => (
            <ComparisonPanel
              key={comparison.variant}
              comparison={comparison}
              position={index + 1}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function ComparisonPanel({
  comparison,
  position,
}: {
  comparison: Comparison;
  position: number;
}) {
  const headingId = `filter-comparison-${comparison.variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex h-full min-h-0 w-[300px] shrink-0 flex-col gap-4"
    >
      <header className="h-28 shrink-0 space-y-2 border-b pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
            Direction 0{position}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px]',
              comparison.variant === 'wrapped' &&
                'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
            )}
          >
            {comparison.category}
          </Badge>
        </div>
        <h2 id={headingId} className="text-sm font-semibold">
          {comparison.title}
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {comparison.description}
        </p>
      </header>
      <ExerciseLibrary variant={comparison.variant} />
      <p className="text-muted-foreground h-8 shrink-0 text-[11px] leading-relaxed">
        {comparison.takeaway}
      </p>
    </section>
  );
}

function ExerciseLibrary({ variant }: { variant: Variant }) {
  const [query, setQuery] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('az');
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [added, setAdded] = useState<string[]>([]);
  const headingId = `filter-library-${variant}`;
  const visible = selectExercises(query, selectedMuscles, sort);
  const narrowed = query.length > 0 || selectedMuscles.length > 0;

  function clearFilters() {
    setQuery('');
    setSelectedMuscles([]);
  }

  return (
    <aside aria-labelledby={headingId} className="min-h-0 flex-1">
      <Card className="h-full min-h-0 gap-3">
        <CardHeader className="shrink-0">
          <CardTitle
            id={headingId}
            className="flex items-center gap-2 font-semibold"
          >
            <Dumbbell aria-hidden="true" className="size-4" />
            Exercise library
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <ArrowRight aria-hidden="true" className="size-3" />
            Adding to <span className="font-medium">{workoutName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="shrink-0 space-y-2.5">
            <LibrarySearch
              label={`Search the ${variant} library`}
              query={query}
              onChange={setQuery}
            />
            {variant !== 'rail' && (
              <MuscleFilter
                variant={variant}
                selected={selectedMuscles}
                onChange={setSelectedMuscles}
              />
            )}
          </div>
          <Separator />
          <div className="flex h-6 shrink-0 items-center justify-between gap-1">
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-muted-foreground text-[11px]"
            >
              {visible.length} of {exercises.length} exercises
            </p>
            <div className="flex items-center gap-1">
              {narrowed && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground text-[10px]"
                  onClick={clearFilters}
                  aria-label="Clear search and muscle filters"
                >
                  Clear
                </Button>
              )}
              <SortToggle
                value={sort}
                onToggle={() =>
                  setSort((current) => current === 'az' ? 'za' : 'az')
                }
              />
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 gap-3">
            {variant === 'rail' && (
              <div className="w-[72px] shrink-0 overflow-y-auto border-r pr-2">
                <MuscleChips
                  selected={selectedMuscles}
                  onChange={setSelectedMuscles}
                  layout="rail"
                />
              </div>
            )}
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-0.5">
              <ExerciseResults
                visible={visible}
                favorites={favorites}
                added={added}
                onFavorite={(name) =>
                  setFavorites((current) => toggleValue(current, name))
                }
                onSelect={(name) =>
                  setAdded((current) => toggleValue(current, name))
                }
                onReset={clearFilters}
              />
            </div>
          </div>
          <p className="text-muted-foreground shrink-0 text-[10px]">
            Preview only · {added.length} selected · not saved
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}

function MuscleFilter({
  variant,
  selected,
  onChange,
}: {
  variant: Exclude<Variant, 'rail'>;
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const optionsId = useId();

  if (variant === 'dropdown') {
    return <MuscleDropdown selected={selected} onChange={onChange} />;
  }

  if (variant === 'foldaway') {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={expanded}
          aria-controls={optionsId}
          className="w-full justify-between text-xs"
          onClick={() => setExpanded((current) => !current)}
        >
          <span className="min-w-0 truncate">
            {selected.length > 0 ? selected.join(', ') : 'All muscles'}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn('size-3 transition-transform', expanded && 'rotate-180')}
          />
        </Button>
        <div id={optionsId} hidden={!expanded}>
          <MuscleChips selected={selected} onChange={onChange} layout="wrap" />
        </div>
      </div>
    );
  }

  return (
    <MuscleChips
      selected={selected}
      onChange={onChange}
      layout={variant === 'scrolling' ? 'scroll' : 'wrap'}
    />
  );
}

function LibrarySearch({
  label,
  query,
  onChange,
}: {
  label: string;
  query: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder="Search exercises…"
        aria-label={label}
        value={query}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 text-xs"
      />
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear search"
            size="icon-xs"
            onClick={() => onChange('')}
          >
            <X aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

function MuscleDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="max-w-full text-xs"
          aria-label={`Muscle filters: ${selected.length > 0 ? selected.join(', ') : 'all muscles'}`}
        >
          <span className="min-w-0 truncate">
            {selected.length > 0 ? selected.join(', ') : 'All muscles'}
          </span>
          <ChevronDown aria-hidden="true" className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-44">
        <DropdownMenuLabel>Muscle · choose any</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onChange([])}>
          All muscles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {muscles.map((muscle) => (
          <DropdownMenuCheckboxItem
            key={muscle}
            checked={selected.includes(muscle)}
            onCheckedChange={() => onChange(toggleValue(selected, muscle))}
            onSelect={(event) => event.preventDefault()}
          >
            {muscle}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortToggle({
  value,
  onToggle,
}: {
  value: Sort;
  onToggle: () => void;
}) {
  const label = value === 'az' ? 'A–Z' : 'Z–A';
  const nextLabel = value === 'az' ? 'Z–A' : 'A–Z';

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      aria-label={`Sorted ${label}. Switch to ${nextLabel}; favorites stay first`}
      title={`Switch to ${nextLabel}. Favorites stay first.`}
      onClick={onToggle}
    >
      <ArrowUpDown aria-hidden="true" className="size-3" />
      <span className="text-[11px]">{label}</span>
    </Button>
  );
}

function MuscleChips({
  selected,
  onChange,
  layout,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
  layout: 'wrap' | 'scroll' | 'rail';
}) {
  return (
    <div
      role="group"
      aria-label="Muscle filters"
      className={cn(
        layout === 'scroll' && 'overflow-x-auto pb-1 [scrollbar-width:thin]',
      )}
    >
      <div
        className={cn(
          'flex gap-1.5 p-0.5',
          layout === 'wrap' && 'flex-wrap',
          layout === 'scroll' && 'w-max',
          layout === 'rail' && 'flex-col',
        )}
      >
        {['All', ...muscles].map((muscle) => {
          const active =
            muscle === 'All' ? selected.length === 0 : selected.includes(muscle);

          return (
            <Button
              key={muscle}
              type="button"
              variant={active ? 'default' : 'outline'}
              size="xs"
              className={cn(
                'rounded-full',
                layout === 'rail' && 'justify-start rounded-md px-2 text-[10px]',
              )}
              aria-label={muscle === 'All' ? 'All muscles' : muscle}
              aria-pressed={active}
              onClick={() =>
                onChange(muscle === 'All' ? [] : toggleValue(selected, muscle))
              }
            >
              {muscle}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseResults({
  visible,
  favorites,
  added,
  onFavorite,
  onSelect,
  onReset,
}: {
  visible: Exercise[];
  favorites: string[];
  added: string[];
  onFavorite: (name: string) => void;
  onSelect: (name: string) => void;
  onReset: () => void;
}) {
  const id = useId();
  const starred = visible.filter((exercise) => favorites.includes(exercise.name));
  const others = visible.filter((exercise) => !favorites.includes(exercise.name));
  const groups = [
    { key: 'starred', label: 'Starred', exercises: starred },
    {
      key: 'others',
      label: starred.length > 0 ? 'More exercises' : 'Exercises',
      exercises: others,
    },
  ];

  if (visible.length === 0) {
    return (
      <Empty className="h-full px-1 py-4">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No matching exercises</EmptyTitle>
          <EmptyDescription className="text-xs">
            Try another search or muscle group.
          </EmptyDescription>
        </EmptyHeader>
        <Button type="button" variant="outline" size="xs" onClick={onReset}>
          Clear filters
        </Button>
      </Empty>
    );
  }

  return groups
    .filter((group) => group.exercises.length > 0)
    .map((group) => (
      <section key={group.key} aria-labelledby={`${id}-${group.key}`}>
        <h3
          id={`${id}-${group.key}`}
          className="bg-card text-muted-foreground sticky top-0 z-10 flex items-center justify-between gap-1 border-b py-2 text-[10px] font-medium"
        >
          <span className="flex items-center gap-1">
            {group.key === 'starred' && (
              <Star aria-hidden="true" className="size-2.5 fill-current" />
            )}
            {group.label}
          </span>
          <span>{group.exercises.length}</span>
        </h3>
        <ItemGroup
          aria-label={group.label}
          className="gap-0 has-data-[size=xs]:gap-0"
        >
          {group.exercises.map((exercise) => (
            <ExerciseEntry
              key={exercise.name}
              exercise={exercise}
              favorite={favorites.includes(exercise.name)}
              added={added.includes(exercise.name)}
              onFavorite={() => onFavorite(exercise.name)}
              onSelect={() => onSelect(exercise.name)}
            />
          ))}
        </ItemGroup>
      </section>
    ));
}

function ExerciseEntry({
  exercise,
  favorite,
  added,
  onFavorite,
  onSelect,
}: {
  exercise: Exercise;
  favorite: boolean;
  added: boolean;
  onFavorite: () => void;
  onSelect: () => void;
}) {
  return (
    <Item
      role="listitem"
      size="xs"
      className="shrink-0 flex-nowrap gap-1 px-0 py-3"
    >
      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="line-clamp-none text-xs leading-relaxed">
          {exercise.name}
        </ItemTitle>
        <ItemDescription className="text-[11px]">
          {exercise.muscle} · {exercise.equipment}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${favorite ? 'Unstar' : 'Star'} ${exercise.name}`}
          aria-pressed={favorite}
          title={favorite ? 'Unstar exercise' : 'Star to keep at the top'}
          onClick={onFavorite}
          className={cn(
            'text-muted-foreground',
            favorite && 'text-amber-600 dark:text-amber-400',
          )}
        >
          <Star aria-hidden="true" className={cn(favorite && 'fill-current')} />
        </Button>
        <Button
          type="button"
          variant={added ? 'secondary' : 'outline'}
          size="icon-xs"
          aria-label={`${added ? 'Unselect' : 'Select'} ${exercise.name} for this preview`}
          aria-pressed={added}
          onClick={onSelect}
        >
          {added ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </Button>
      </ItemActions>
    </Item>
  );
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ?
      values.filter((item) => item !== value)
    : [...values, value];
}

function selectExercises(query: string, selectedMuscles: string[], sort: Sort) {
  const search = query.trim().toLocaleLowerCase();

  return exercises
    .filter((exercise) => {
      const matchesSearch =
        `${exercise.name} ${exercise.muscle} ${exercise.equipment}`
          .toLocaleLowerCase()
          .includes(search);
      const matchesMuscle =
        selectedMuscles.length === 0 || selectedMuscles.includes(exercise.muscle);

      return matchesSearch && matchesMuscle;
    })
    .sort((a, b) => {
      const alphabetical = a.name.localeCompare(b.name);
      return sort === 'az' ? alphabetical : -alphabetical;
    });
}
