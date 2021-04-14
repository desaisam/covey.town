import Phaser from 'phaser';

export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  
  private readonly _avatar: string;

  public sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  public label?: Phaser.GameObjects.Text;

  constructor(id: string, userName: string, location: UserLocation, avatar: string) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this._avatar = avatar;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  get avatar(): string {
    return this._avatar;
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(playerFromServer._id, playerFromServer._userName, playerFromServer.location, 'barmaid');
  }
}
export type ServerPlayer = { _id: string, _userName: string, location: UserLocation, _avatar: string };

export type Direction = 'front'|'back'|'left'|'right';

export type UserLocation = {
  x: number,
  y: number,
  rotation: Direction,
  moving: boolean
};
