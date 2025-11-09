# Technical Specification: ChromaWing

## Technology Stack

### Frontend (Recommended)
- **Framework**: React or Vue.js
- **Graphics**:
  - Canvas API or WebGL for parrot rendering
  - SVG for UI elements
  - Sprite-based or procedurally generated parrots
- **State Management**: Redux/Vuex or Context API
- **Styling**: CSS3 with CSS Grid/Flexbox, or Tailwind CSS

### Backend (Optional for multiplayer)
- **Server**: Node.js with Express
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT tokens
- **Real-time**: WebSocket for live competitions

### For Single-Player Web Version
- **Storage**: LocalStorage or IndexedDB
- **Save System**: JSON serialization of game state
- **Progressive Web App**: Offline capability

## Core Systems Architecture

### 1. Genetics Engine

```javascript
// Gene class
class Gene {
  constructor(name, allele1, allele2) {
    this.name = name;
    this.alleles = [allele1, allele2];
  }

  isDominant(allele) {
    return allele === allele.toUpperCase();
  }

  getPhenotype() {
    // Determine expressed trait from alleles
    const [a1, a2] = this.alleles;

    // Both dominant or one dominant
    if (this.isDominant(a1) || this.isDominant(a2)) {
      return 'dominant';
    }
    return 'recessive';
  }

  getRandomAllele() {
    return this.alleles[Math.floor(Math.random() * 2)];
  }
}

// Genome class
class Genome {
  constructor(genes = {}) {
    this.genes = genes;
  }

  static createRandom() {
    // Generate random starting genome
    const geneList = [
      new Gene('red', this.randomAllele('R'), this.randomAllele('R')),
      new Gene('yellow', this.randomAllele('Y'), this.randomAllele('Y')),
      new Gene('blue', this.randomAllele('B'), this.randomAllele('B')),
      // ... more genes
    ];

    return new Genome(geneList);
  }

  static randomAllele(letter) {
    return Math.random() > 0.5 ? letter.toUpperCase() : letter.toLowerCase();
  }

  getGene(name) {
    return this.genes.find(g => g.name === name);
  }
}

// Breeding function
function breed(parent1, parent2, mutationRate = 0.01) {
  const offspringGenes = [];

  // For each gene type
  const geneTypes = Object.keys(parent1.genome.genes);

  for (let geneType of geneTypes) {
    const gene1 = parent1.genome.getGene(geneType);
    const gene2 = parent2.genome.getGene(geneType);

    // Get one random allele from each parent
    let allele1 = gene1.getRandomAllele();
    let allele2 = gene2.getRandomAllele();

    // Check for mutation
    if (Math.random() < mutationRate) {
      allele1 = mutate(allele1);
    }
    if (Math.random() < mutationRate) {
      allele2 = mutate(allele2);
    }

    offspringGenes.push(new Gene(geneType, allele1, allele2));
  }

  return new Genome(offspringGenes);
}

function mutate(allele) {
  // Randomly flip to dominant or recessive
  return Math.random() > 0.5 ?
    allele.toUpperCase() :
    allele.toLowerCase();
}
```

### 2. Parrot Class

```javascript
class Parrot {
  constructor(name, genome, generation = 1) {
    this.id = generateUUID();
    this.name = name;
    this.genome = genome;
    this.generation = generation;
    this.birthday = Date.now();

    // Derived from genetics
    this.phenotype = this.calculatePhenotype();
    this.stats = this.calculateStats();
    this.rarity = this.calculateRarity();

    // Game state
    this.energy = 100;
    this.trainingProgress = {
      speed: 0,
      agility: 0,
      intelligence: 0,
      stamina: 0
    };
    this.competitionHistory = [];
    this.trophies = [];
  }

  calculatePhenotype() {
    // Convert genotype to visual/stat phenotype
    const redGene = this.genome.getGene('red');
    const yellowGene = this.genome.getGene('yellow');
    const blueGene = this.genome.getGene('blue');
    const intensityGene = this.genome.getGene('intensity');

    // Calculate colors based on gene combinations
    const colors = {
      red: this.calculateColorValue(redGene, intensityGene),
      yellow: this.calculateColorValue(yellowGene, intensityGene),
      blue: this.calculateColorValue(blueGene, intensityGene)
    };

    return {
      bodyColor: this.mixColors(colors),
      pattern: this.calculatePattern(),
      crestSize: this.calculateCrestSize(),
      tailLength: this.calculateTailLength(),
      size: this.calculateSize()
    };
  }

  calculateStats() {
    // Base stats from genes
    const speedGene = this.genome.getGene('speed');
    const agilityGene = this.genome.getGene('agility');
    const intelligenceGene = this.genome.getGene('intelligence');
    const staminaGene = this.genome.getGene('stamina');

    return {
      speed: this.geneToStat(speedGene, 50, 100),
      agility: this.geneToStat(agilityGene, 50, 100),
      intelligence: this.geneToStat(intelligenceGene, 50, 100),
      stamina: this.geneToStat(staminaGene, 50, 100)
    };
  }

  geneToStat(gene, min, max) {
    const [a1, a2] = gene.alleles;
    const domCount = [a1, a2].filter(a => a === a.toUpperCase()).length;

    // 0 dominant = min, 1 dominant = mid, 2 dominant = max
    const range = max - min;
    return min + (range * domCount / 2);
  }

  calculateRarity() {
    // Calculate how rare this combination is
    // Based on recessive traits, color combos, etc.
    let rarityScore = 0;

    // Add rarity for specific gene combinations
    // (simplified example)

    if (rarityScore < 50) return 'Common';
    if (rarityScore < 75) return 'Uncommon';
    if (rarityScore < 90) return 'Rare';
    if (rarityScore < 98) return 'Epic';
    return 'Legendary';
  }

  getStarRating(category) {
    // Calculate 1-5 star rating for specific category
    const stat = this.stats[category];

    if (stat >= 90) return 5;
    if (stat >= 75) return 4;
    if (stat >= 60) return 3;
    if (stat >= 40) return 2;
    return 1;
  }

  canCompete() {
    return this.energy >= 20;
  }

  compete(competition) {
    if (!this.canCompete()) {
      return { success: false, reason: 'Insufficient energy' };
    }

    this.energy -= 20;

    const score = competition.calculateScore(this);
    const result = competition.determineResult(score);

    this.competitionHistory.push({
      competition: competition.name,
      score: score,
      result: result,
      date: Date.now()
    });

    return result;
  }

  train(stat, amount) {
    const maxTraining = this.stats[stat] * 0.2;
    this.trainingProgress[stat] = Math.min(
      this.trainingProgress[stat] + amount,
      maxTraining
    );
  }

  getCurrentStat(stat) {
    return this.stats[stat] + this.trainingProgress[stat];
  }
}
```

### 3. Competition System

```javascript
class Competition {
  constructor(name, type, tier, entryFee, requirements) {
    this.name = name;
    this.type = type; // 'beauty', 'speed', 'agility', etc.
    this.tier = tier; // 1-5
    this.entryFee = entryFee;
    this.requirements = requirements;
  }

  canEnter(parrot) {
    if (parrot.getStarRating(this.type) < this.requirements.minStars) {
      return false;
    }
    return true;
  }

  calculateScore(parrot) {
    switch(this.type) {
      case 'beauty':
        return this.calculateBeautyScore(parrot);
      case 'speed':
        return this.calculateSpeedScore(parrot);
      case 'agility':
        return this.calculateAgilityScore(parrot);
      // ... more types
      default:
        return 0;
    }
  }

  calculateBeautyScore(parrot) {
    let score = 0;

    // Color vibrancy (30%)
    score += parrot.phenotype.colorIntensity * 0.3;

    // Color harmony (25%)
    score += this.calculateColorHarmony(parrot.phenotype.bodyColor) * 0.25;

    // Pattern appeal (20%)
    score += this.calculatePatternScore(parrot.phenotype.pattern) * 0.2;

    // Feature balance (15%)
    score += this.calculateFeatureBalance(parrot.phenotype) * 0.15;

    // Rarity bonus (10%)
    score += this.rarityToScore(parrot.rarity) * 0.1;

    // Add some randomness (±5%)
    score *= (0.95 + Math.random() * 0.1);

    return Math.round(score);
  }

  calculateSpeedScore(parrot) {
    const baseSpeed = parrot.getCurrentStat('speed');
    const sizeModifier = this.getSizeModifier(parrot.phenotype.size);
    const wingModifier = this.getWingModifier(parrot.phenotype.wingShape);
    const staminaFactor = parrot.getCurrentStat('stamina') / 100;

    const score = baseSpeed * sizeModifier * wingModifier * staminaFactor;

    // Add randomness for race conditions
    return Math.round(score * (0.9 + Math.random() * 0.2));
  }

  determineResult(score) {
    // Compete against AI opponents or score threshold
    const placement = this.determinePlace(score);
    const rewards = this.calculateRewards(placement);

    return {
      score: score,
      placement: placement,
      rewards: rewards,
      won: placement <= 3
    };
  }

  determinePlace(score) {
    // Simple AI competition - generate opponent scores
    const opponents = [];
    for (let i = 0; i < 10; i++) {
      const opponentScore = this.generateOpponentScore();
      opponents.push(opponentScore);
    }

    opponents.push(score);
    opponents.sort((a, b) => b - a);

    return opponents.indexOf(score) + 1;
  }

  generateOpponentScore() {
    // Generate realistic opponent score based on tier
    const baseScore = 50 + (this.tier * 10);
    const variance = 20;
    return baseScore + (Math.random() * variance - variance/2);
  }

  calculateRewards(placement) {
    const rewards = {
      credits: 0,
      reputation: 0,
      items: []
    };

    if (placement === 1) {
      rewards.credits = this.tier * 500;
      rewards.reputation = this.tier * 50;
      if (this.tier >= 3) {
        rewards.items.push('genetic_sample_' + this.type);
      }
    } else if (placement <= 3) {
      rewards.credits = this.tier * 200;
      rewards.reputation = this.tier * 20;
    } else if (placement <= 5) {
      rewards.credits = this.tier * 50;
      rewards.reputation = this.tier * 5;
    }

    return rewards;
  }
}
```

### 4. Visual Rendering System

#### Procedural Parrot Generation

```javascript
class ParrotRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  render(parrot) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const phenotype = parrot.phenotype;

    // Draw parrot based on phenotype
    this.drawBody(phenotype.bodyColor, phenotype.size);
    this.drawWings(phenotype.bodyColor, phenotype.wingShape);
    this.drawTail(phenotype.bodyColor, phenotype.tailLength, phenotype.pattern);
    this.drawHead(phenotype.bodyColor, phenotype.crestSize);
    this.drawBeak();
    this.drawEyes();

    if (phenotype.pattern !== 'solid') {
      this.applyPattern(phenotype.pattern);
    }
  }

  drawBody(color, size) {
    const scale = this.sizeToScale(size);

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(150, 150, 50 * scale, 70 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Add gradient for depth
    const gradient = this.ctx.createRadialGradient(
      140, 140, 10,
      150, 150, 70 * scale
    );
    gradient.addColorStop(0, this.lightenColor(color, 30));
    gradient.addColorStop(1, this.darkenColor(color, 20));

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  // ... more drawing methods

  applyPattern(pattern) {
    if (pattern === 'speckled') {
      this.drawSpeckles();
    } else if (pattern === 'striped') {
      this.drawStripes();
    }
  }

  lightenColor(color, percent) {
    // Lighten hex color by percent
    // ... implementation
  }

  darkenColor(color, percent) {
    // Darken hex color by percent
    // ... implementation
  }
}
```

### 5. Save System

```javascript
class SaveManager {
  constructor() {
    this.storageKey = 'chromawing_save';
  }

  save(gameState) {
    const saveData = {
      version: '1.0',
      timestamp: Date.now(),
      player: {
        name: gameState.player.name,
        level: gameState.player.level,
        credits: gameState.player.credits,
        reputation: gameState.player.reputation
      },
      parrots: gameState.parrots.map(p => this.serializeParrot(p)),
      facilities: gameState.facilities,
      achievements: gameState.achievements
    };

    const json = JSON.stringify(saveData);
    localStorage.setItem(this.storageKey, json);

    return true;
  }

  load() {
    const json = localStorage.getItem(this.storageKey);
    if (!json) return null;

    const saveData = JSON.parse(json);

    // Reconstruct game state
    const gameState = {
      player: saveData.player,
      parrots: saveData.parrots.map(p => this.deserializeParrot(p)),
      facilities: saveData.facilities,
      achievements: saveData.achievements
    };

    return gameState;
  }

  serializeParrot(parrot) {
    return {
      id: parrot.id,
      name: parrot.name,
      genome: this.serializeGenome(parrot.genome),
      generation: parrot.generation,
      birthday: parrot.birthday,
      energy: parrot.energy,
      trainingProgress: parrot.trainingProgress,
      competitionHistory: parrot.competitionHistory
    };
  }

  deserializeParrot(data) {
    const genome = this.deserializeGenome(data.genome);
    const parrot = new Parrot(data.name, genome, data.generation);
    parrot.id = data.id;
    parrot.birthday = data.birthday;
    parrot.energy = data.energy;
    parrot.trainingProgress = data.trainingProgress;
    parrot.competitionHistory = data.competitionHistory;
    return parrot;
  }
}
```

## UI/UX Design

### Main Screens

1. **Home/Dashboard**
   - Overview of sanctuary
   - Quick stats
   - Active parrots
   - Notifications

2. **Aviary**
   - Grid of all parrots
   - Filter by traits/stats
   - Quick actions (compete, train, breed)

3. **Breeding Lab**
   - Select parents
   - View predictions
   - Hatch eggs
   - Name offspring

4. **Competition Hall**
   - Browse available competitions
   - View requirements
   - Enter events
   - View results/leaderboards

5. **Training Grounds**
   - Select parrot and stat
   - Training mini-games
   - Progress tracking

6. **Genetics Lab** (unlockable)
   - Detailed gene view
   - Breeding calculator
   - Research notes

7. **Trophy Room**
   - Achievements
   - Competition history
   - Notable parrots (hall of fame)

### UI Components

- **Parrot Card**: Shows image, name, stars, key stats
- **Gene Viewer**: Visual representation of genome
- **Breeding Calculator**: Punnett square style predictions
- **Stat Bars**: Visual representation of stats with training overlay
- **Competition Results**: Animated reveal of placement/rewards

## Performance Considerations

### Optimization Strategies

1. **Limit Active Rendering**: Only render visible parrots
2. **Sprite Caching**: Cache rendered parrots, regenerate only on change
3. **Lazy Loading**: Load competition data and history on-demand
4. **Data Compression**: Compress save data
5. **Debounce Updates**: Throttle frequent calculations

### Scalability

- Support for 50+ parrots in late game
- Efficient genome storage (bit packing for alleles)
- Indexed searching/filtering for large collections

## Testing Requirements

### Unit Tests
- Breeding algorithm (ensure Mendelian inheritance)
- Stat calculations
- Competition scoring
- Mutation rates

### Integration Tests
- Full breeding workflow
- Competition entry to rewards
- Save/load integrity
- Training progression

### Balance Testing
- Competition difficulty curves
- Resource economy
- Progression pacing
- Trait value balance

## Future Enhancements

### Phase 2 Features
- Multiplayer trading and competitions
- Seasonal events
- Additional creature types (other birds)
- Advanced genetics (linked genes, epistasis)

### Phase 3 Features
- Mobile app version
- Social features (clubs, breeding cooperatives)
- User-generated competitions
- Mod support for custom traits

## Development Milestones

### MVP (Minimum Viable Product)
- Core genetics engine
- Basic parrot rendering
- 3 competition types
- Breeding system
- Local save/load
- ~3-4 months development

### Beta Release
- All competition types
- Training system
- Achievements
- Polished UI
- Balance testing
- ~2-3 months additional

### Full Release
- Tutorial system
- Sound effects and music
- Polish and optimization
- Documentation
- ~1-2 months additional
