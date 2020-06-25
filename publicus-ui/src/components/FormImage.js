import React from "react";

const defaultImage = "https://designshack.net/wp-content/uploads/placeholder-image.png";

// Component for rendering the image linked to a form
class FormImage extends React.Component {

  // Get the form image url from props
  getState = () => {
    const { image } = this.props;
    return {
      url: image || defaultImage
    }
  };

  state = this.getState();

  // Render default form image if an error occurs
  onError = () => {
    this.setState({
      url: defaultImage
    })
  };

  render() {
    const { url } = this.state;
    const { height, width } = this.props;
    return (
      <img
        id={"formImage"}
        alt={"formImage"}
        width={height || 270}
        height={width || 180}
        src={url}
        onError={this.onError}
      />
    )
  }

}

export default FormImage;