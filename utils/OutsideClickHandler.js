import React, { createRef } from "react";

class OutsideClickHandler extends React.Component {
  wrapperRef = createRef();
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener("mouseleave", this.handleMouseLeave);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.onClick();
    }
  };
  render() {
    return <div ref={this.wrapperRef} onMouseLeave={this.props.onMouseLeave} className={this.props.className} >{this.props.children}</div>;
  }
}

export default OutsideClickHandler;
