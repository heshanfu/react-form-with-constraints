import React from 'react';
import PropTypes from 'prop-types';

import {
  FormWithConstraints as _FormWithConstraints, FormWithConstraintsProps, FormWithConstraintsChildContext,
  FieldFeedbacks, Async, FieldFeedback, Field
} from 'react-form-with-constraints';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  innerRef?: React.Ref<HTMLInputElement>;
}

export interface FormInputState {
  field: Field | undefined;
}

export type FormInputContext = FormWithConstraintsChildContext;

export class FormInput extends React.Component<FormInputProps, FormInputState> {
  static contextTypes: React.ValidationMap<FormInputContext> = {
    form: PropTypes.object.isRequired
  };
  context!: FormInputContext;

  constructor(props: FormInputProps) {
    super(props);

    this.state = {
      field: undefined
    };

    this.fieldWillValidate = this.fieldWillValidate.bind(this);
    this.fieldDidValidate = this.fieldDidValidate.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    this.context.form.addFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.addFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.addResetEventListener(this.reset);
  }

  componentWillUnmount() {
    this.context.form.removeFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.removeFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.removeResetEventListener(this.reset);
  }

  fieldWillValidate(fieldName: string) {
    if (fieldName === this.props.name) { // Ignore the event if it's not for us
      this.setState({field: undefined});
    }
  }

  fieldDidValidate(field: Field) {
    if (field.name === this.props.name) { // Ignore the event if it's not for us
      this.setState({field});
    }
  }

  reset() {
    this.setState({field: undefined});
  }

  validationStateClassName() {
    const { field } = this.state;

    let className;

    if (field !== undefined) {
      if (field.hasErrors()) {
        className = 'is-invalid';
      }
      else if (field.hasWarnings()) {
        // form-control-warning did exist in Bootstrap v4.0.0-alpha.6:
        // see https://v4-alpha.getbootstrap.com/components/forms/#validation
        // see https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_forms.scss#L255
        // In Bootstrap 3 it was done on form-group not an the input directly:
        // see https://getbootstrap.com/docs/3.3/css/#forms-control-validation
        // see https://github.com/twbs/bootstrap/blob/v3.3.7/less/forms.less#L431
        className = 'is-warning';
      }
      else if (field.isValid()) {
        className = 'is-valid';
      }
    }
    return className;
  }

  render() {
    const { innerRef, className, children, ...inputProps } = this.props;
    const validationStateClassName = this.validationStateClassName();

    let classNames = className;
    if (validationStateClassName !== undefined) {
      if (className !== undefined) classNames += ` ${validationStateClassName}`;
      else classNames = validationStateClassName;
    }

    return (
      <input ref={innerRef} {...inputProps} className={classNames} />
    );
  }
}

export class FormWithConstraints extends _FormWithConstraints {
  static defaultProps: FormWithConstraintsProps = {
    fieldFeedbackClassNames: {
      error: 'invalid-feedback',
      warning: 'warning-feedback',
      info: 'info-feedback',
      valid: 'valid-feedback'
    }
  };
}

export class FormWithConstraintsTooltip extends _FormWithConstraints {
  static defaultProps: FormWithConstraintsProps = {
    fieldFeedbackClassNames: {
      error: 'invalid-tooltip',
      warning: 'warning-tooltip',
      info: 'info-tooltip',
      valid: 'valid-tooltip'
    }
  };
}

export { FieldFeedbacks, Async, FieldFeedback };
