import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "./cx";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Required: ties the label, hint and error to the input. */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Replaces the hint and marks the input invalid. */
  error?: ReactNode;
  /** Fixed text before the value, for example "₦". */
  prefix?: ReactNode;
  /** Adds "(optional)" after the label. */
  optional?: boolean;
}

export function TextField({ id, label, hint, error, prefix, optional, className, type = "text", ...rest }: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cx("cr-field", error ? "has-error" : null, className)}>
      <label className="cr-field__label" htmlFor={id}>
        {label}
        {optional && <span className="cr-field__optional"> (optional)</span>}
      </label>
      <div className="cr-field__control">
        {prefix && (
          <span className="cr-field__prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          {...rest}
          id={id}
          type={type}
          className="cr-field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      </div>
      {error ? (
        <p id={errorId} className="cr-field__error" role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={hintId} className="cr-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
