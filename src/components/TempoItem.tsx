import { Component } from "react";
import { TempoStep } from "../App";

type TempoItemProps = {
  tempo: number;
  type: TempoStep["type"];
  active: boolean;
};

export default class TempoItem extends Component<TempoItemProps> {
  render() {
    return (
      <div
        className={
          "w-8 h-8 text-center font-semibold rounded flex " +
          this.getBackgroundColor()
        }
      >
        <div className="m-auto">{this.props.tempo}</div>
      </div>
    );
  }

  private getBackgroundColor() {
    if (this.props.active) return "bg-ming-800 text-ming-200";
    if (this.props.type == "jump") return "bg-ming-500";
    return "bg-ming-400";
  }
}
