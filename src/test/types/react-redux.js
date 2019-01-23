/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// @flow

import * as React from 'react';
import explicitConnect from '../../utils/connect';

import type {
  ExplicitConnectOptions,
  ConnectedProps,
  WrapDispatchProps,
  WrapFunctionInDispatch,
} from '../../utils/connect';
import type {
  State,
  Action,
  ThunkAction,
  Dispatch,
  GetState,
} from '../../types/store';
/* eslint-disable no-unused-vars, react/prefer-stateless-function, flowtype/no-unused-expressions */

// Use this any value to create fake variables as a type. Consider using
// `declare var myVariables: MyType;` instead. However, it can sometimes be clearer to
// create values inline, or from pre-existing type definitions. In addition,
// `declare var` is not correctly lexically scoped.
const ANY_VALUE = (0: any);

/**
 * These type tests create various values that should all type check correctly to show
 * that the react-redux system is working correctly.
 */

type OwnProps = {|
  +ownPropString: string,
  +ownPropNumber: number,
|};

type StateProps = {|
  +statePropString: string,
  +statePropNumber: number,
|};

type ExampleActionCreator = string => Action;
type ExampleThunkActionCreator = string => ThunkAction<number>;

type DispatchProps = {|
  +dispatchString: ExampleActionCreator,
  +dispatchThunk: ExampleThunkActionCreator,
|};

type Props = ConnectedProps<OwnProps, StateProps, DispatchProps>;

class ExampleComponent extends React.PureComponent<Props> {
  render() {
    // Ensure that the React component has the correct types inside of it.
    (this.props.ownPropString: string);
    (this.props.ownPropNumber: number);
    (this.props.statePropString: string);
    (this.props.statePropNumber: number);

    // The action creators are properly wrapped by dispatch.
    (this.props.dispatchString: string => Action);
    (this.props.dispatchThunk: string => number);
    (this.props.dispatchThunk('foo'): number);

    return null;
  }
}

const validMapStateToProps = (state, ownProps) => {
  // Coerce the inferred types, to ensure that we are doing the right thing.
  (state: State);
  (ownProps: OwnProps);
  return {
    statePropString: 'string',
    statePropNumber: 0,
  };
};

declare var validDispatchToProps: {|
  +dispatchString: string => Action,
  +dispatchThunk: string => ThunkAction<number>,
|};

// This value also serves as a test for the common case of creating a component
// with valid values.
const ConnectedExampleComponent = explicitConnect(
  ({
    mapStateToProps: validMapStateToProps,
    mapDispatchToProps: validDispatchToProps,
    component: ExampleComponent,
  }: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps>)
);

{
  // Test that WrapDispatchProps modifies the ThunkActions.
  const wrapped: WrapDispatchProps<DispatchProps> = (ANY_VALUE: {|
    +dispatchString: string => Action,
    +dispatchThunk: string => number,
  |});
}

{
  // Test that the original unwrapped action creators do not work.
  const wrapped: WrapDispatchProps<DispatchProps> = (ANY_VALUE: {|
    +dispatchString: string => Action,
    // $FlowExpectError
    +dispatchThunk: string => ThunkAction<number>,
  |});
}

{
  // Test that WrapFunctionInDispatch works to strip off the return action.
  const exampleAction = (string: string) => (ANY_VALUE: Action);
  const exampleThunkAction = (string: string) => (
    dispatch: Dispatch,
    getState: GetState
  ) => (ANY_VALUE: number);
  const exampleThunkActionWrapped = (string: string) => 5;

  (exampleAction: WrapFunctionInDispatch<ExampleActionCreator>);
  (exampleThunkActionWrapped: WrapFunctionInDispatch<
    ExampleThunkActionCreator
  >);
  // $FlowExpectError
  (exampleThunkAction: WrapFunctionInDispatch<ExampleThunkActionCreator>);
}

{
  // Test that mapStateToProps will error out if provided an extra value.
  const options: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps> = {
    // $FlowExpectError
    mapStateToProps: state => ({
      statePropString: 'string',
      statePropNumber: 0,
      extraValue: null,
    }),
    mapDispatchToProps: validDispatchToProps,
    component: ExampleComponent,
  };
  explicitConnect(options);
}

{
  // Test that mapStateToProps will error if provided an extra value.
  const options: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps> = {
    mapStateToProps: state => ({
      statePropString: 'string',
      // $FlowExpectError
      statePropNumber: 'not a number',
    }),
    mapDispatchToProps: validDispatchToProps,
    component: ExampleComponent,
  };
  explicitConnect(options);
}

{
  // Test that mapDispatchToProps will error if a value is omitted.
  const options: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps> = {
    mapStateToProps: validMapStateToProps,
    // $FlowExpectError
    mapDispatchToProps: (ANY_VALUE: {|
      +dispatchThunk: string => ThunkAction<number>,
    |}),
    component: ExampleComponent,
  };
  explicitConnect(options);
}

{
  // Test that mapDispatchToProps will error if a variable type definition is wrong.
  const options: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps> = {
    mapStateToProps: validMapStateToProps,
    mapDispatchToProps: (ANY_VALUE: {|
      // $FlowExpectError
      +dispatchString: string => string,
      +dispatchThunk: string => ThunkAction<number>,
    |}),
    component: ExampleComponent,
  };
  explicitConnect(options);
}

{
  // Test that mapDispatchToProps will error if an extra property is given.
  const options: ExplicitConnectOptions<OwnProps, StateProps, DispatchProps> = {
    mapStateToProps: validMapStateToProps,
    // $FlowExpectError
    mapDispatchToProps: (ANY_VALUE: {|
      ...typeof validDispatchToProps,
      +extraProperty: string => string,
    |}),
    component: ExampleComponent,
  };
  explicitConnect(options);
}

{
  // The connected component correctly takes OwnProps.
  <ConnectedExampleComponent ownPropString="string" ownPropNumber={0} />;
}

{
  // The connected component must not accept more props.
  // $FlowExpectError
  <ConnectedExampleComponent
    ownPropString="string"
    ownPropNumber={0}
    ownPropsExtra={0}
  />;
}

{
  // It throws an error when an OwnProps is incorrect.
  // $FlowExpectError
  <ConnectedExampleComponent ownPropString={0} ownPropNumber={0} />;
}

{
  // It throws an error if no OwnProps are provided.
  // $FlowExpectError
  <ConnectedExampleComponent />;
}