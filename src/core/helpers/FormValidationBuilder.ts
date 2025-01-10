import _ from "lodash";
import * as Yup from "yup";

export function createYupValidationSchema(validationRules) {
  const schemaObj = {};

  for (const fieldName in validationRules) {
    if (typeof validationRules[fieldName] === "string") {
      const fieldRules = validationRules[fieldName].split("&");
      let fieldSchema;

      if (validationRules[fieldName].includes("numberRequired")) {
        fieldSchema = Yup.number().typeError(
          _.capitalize(_.toLower(_.startCase(`${fieldName} must be a Number`)))
        );
      } else {
        fieldSchema = Yup.string().typeError(
          _.capitalize(_.toLower(_.startCase(`${fieldName} must be a String`)))
        );
      }

      fieldRules.forEach((rule) => {
        const [ruleName, ruleParam, message] = rule.trim().split(":");

        switch (ruleName) {
          case "min":
            fieldSchema = fieldSchema.min(
              parseInt(ruleParam, 10),
              _.capitalize(
                _.toLower(
                  _.startCase(
                    message || `${fieldName} must be at least ${ruleParam}`
                  )
                )
              )
            );
            break;
          case "max":
            fieldSchema = fieldSchema.max(
              parseInt(ruleParam, 10),
              _.capitalize(
                _.toLower(
                  _.startCase(
                    message || `${fieldName} must be at most ${ruleParam}`
                  )
                )
              )
            );
            break;
          case "required":
            fieldSchema = fieldSchema.required(
              _.capitalize(_.toLower(_.startCase(`${fieldName} is required`)))
            );
            break;
          case "email":
            fieldSchema = fieldSchema.email(
              _.capitalize(_.toLower(_.startCase(message || "Invalid email")))
            );
            break;
          case "url":
            fieldSchema = fieldSchema.url(
              _.capitalize(_.toLower(_.startCase(message || "Invalid URL")))
            );
            break;
          case "matches":
            fieldSchema = fieldSchema.matches(
              new RegExp(ruleParam),

              _.capitalize(
                _.toLower(
                  message ||
                    _.startCase(`${fieldName} does not matches the pattern`)
                )
              )
            );
            break;
          case "nullable":
            fieldSchema = fieldSchema.nullable();
            break;
          case "oneOf":
            fieldSchema = fieldSchema.oneOf(
              ruleParam.split(","),
              _.capitalize(
                _.toLower(_.startCase(message || `Invalid ${fieldName}`))
              )
            );
            break;
          case "notOneOf":
            fieldSchema = fieldSchema.notOneOf(
              ruleParam.split(","),
              _.capitalize(
                _.toLower(_.startCase(message || `Invalid ${fieldName}`))
              )
            );
            break;
          case "minLength":
            fieldSchema = fieldSchema.min(
              parseInt(ruleParam, 10),
              _.capitalize(
                _.toLower(
                  _.startCase(
                    message ||
                      `${fieldName} must have at least ${ruleParam} characters`
                  )
                )
              )
            );
            break;
          case "maxLength":
            fieldSchema = fieldSchema.max(
              parseInt(ruleParam, 10),
              _.capitalize(
                _.toLower(
                  _.startCase(
                    message ||
                      `${fieldName} must have at most ${ruleParam} characters`
                  )
                )
              )
            );
            break;
          default:
            break;
        }
      });

      schemaObj[fieldName] = fieldSchema;
    } else {
      // this code will execute if custom validation is given
      schemaObj[fieldName] = validationRules[fieldName];
    }
  }

  return Yup.object().shape(schemaObj);
}

// example

// const validationRules = {
//     password: "required&minLength:10",
//     email: "required&email",
//     username: "required&string&minLength:3&maxLength:20",
//     role: "required&oneOf:user,admin,moderator",
//     age: "min:0&max:30&nullable&notOneOf:0,10",
//   };

//   const schema = createBaseValidationSchema(validationRules);
//   const schema2 = {
//       confirmPassword: yup
//         .string()
//         .oneOf([yup.ref("password"), null], "Passwords must match"),
//       password:yup
//       .string()
//     }

//   const comb = concatSchema(schema,schema2)

//   console.log(Object.keys(comb.fields))

//   // Test Case 1: Valid object
//   const validObject = {
//     password: "passwor",
//     email: "test@example.com",
//     username: "john_doe",
//     role: "admin",
//     age: 10,
//     confirmPassword: "passwor",
//   };

//   comb
//     .validate(validObject)
//     .then(() => console.log("Valid object passed validation"))
//     .catch((error) => console.error("Valid object failed validation:", error));
