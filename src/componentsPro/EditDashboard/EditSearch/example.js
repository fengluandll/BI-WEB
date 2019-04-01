import React, { PureComponent } from 'react';
import Dustbin from './Dustbin'
import Box from './Box'
const rowStyle = { overflow: 'hidden', clear: 'both' }

class Container extends PureComponent {
  render() {
    const { idColumns_arr, idColumns_searchItem_arr } = this.props;
    return (
      <div>
        <div style={rowStyle}>
          <Dustbin
            idColumns_searchItem_arr={idColumns_searchItem_arr}
          />
        </div>
        <div style={rowStyle}>
          {
            idColumns_arr.map((item, index) => {
              return (
                <Box name="Glass" item={item} key={index} />
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default Container