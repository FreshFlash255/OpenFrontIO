import { Execution, Game, Gold, Player, Unit, UnitType } from "../game/Game";
import { TileRef } from "../game/GameMap";

export class FarmlandExecution implements Execution {
  private farmland: Unit | null = null;
  private active: boolean = true;
  private game: Game;
  constructor(
    private player: Player,
    private tile: TileRef,
  ) {}

  init(mg: Game, ticks: number): void {
    this.game = mg;
  }

  tick(ticks: number): void {
    if (!this.farmland) {
      const spawnTile = this.player.canBuild(UnitType.Farmland, this.tile);
      if (spawnTile === false) {
        console.warn("cannot build farmland");
        this.active = false;
        return;
      }
      this.farmland = this.player.buildUnit(UnitType.Farmland, spawnTile, {});
    }
    if (!this.farmland.isActive()) {
      this.active = false;
      return;
    }

    if (this.player !== this.farmland.owner()) {
      this.player = this.farmland.owner();
    }

    // Generate gold per tick
    const goldPerTick = this.game.config().farmlandGoldPerTick();
    if (goldPerTick > 0n) {
      this.player.addGold(goldPerTick, this.farmland.tile());
    }
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}

