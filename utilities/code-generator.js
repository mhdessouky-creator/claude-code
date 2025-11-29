/**
 * Code Generator Utilities - أدوات توليد الكود
 * مساعدات لتوليد كود شائع الاستخدام
 * Helpers for generating commonly used code
 */

class CodeGenerator {
  /**
   * توليد نموذج API endpoint
   * Generate API endpoint template
   */
  static generateAPIEndpoint(name, method = 'GET') {
    const upperMethod = method.toUpperCase();
    const handlerName = `${name}Handler`;

    return `
/**
 * ${name} API Endpoint
 */
router.${method.toLowerCase()}('/api/${name.toLowerCase()}', async (req, res) => {
  try {
    const { /* parameters */ } = req.${upperMethod === 'GET' ? 'query' : 'body'};

    // معالجة الطلب - Process request
    const result = await ${handlerName}(/* parameters */);

    // إرسال الاستجابة - Send response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in ${name}:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function ${handlerName}(/* parameters */) {
  // تنفيذ المنطق هنا - Implement logic here
  return {};
}
`;
  }

  /**
   * توليد نموذج React Component
   * Generate React Component template
   */
  static generateReactComponent(name, hasState = false) {
    if (hasState) {
      return `
import React, { useState, useEffect } from 'react';

/**
 * ${name} Component
 */
function ${name}({ /* props */ }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Component did mount logic
    return () => {
      // Cleanup logic
    };
  }, []);

  const handleAction = () => {
    // معالج الحدث - Event handler
  };

  return (
    <div className="${name.toLowerCase()}">
      <h2>${name}</h2>
      {/* Component content */}
    </div>
  );
}

export default ${name};
`;
    } else {
      return `
import React from 'react';

/**
 * ${name} Component
 */
function ${name}({ /* props */ }) {
  return (
    <div className="${name.toLowerCase()}">
      <h2>${name}</h2>
      {/* Component content */}
    </div>
  );
}

export default ${name};
`;
    }
  }

  /**
   * توليد نموذج فئة Python
   * Generate Python class template
   */
  static generatePythonClass(name) {
    return `
class ${name}:
    """${name} class - فئة ${name}"""

    def __init__(self):
        """تهيئة الفئة - Initialize class"""
        pass

    def method_name(self, param):
        """وصف الدالة - Method description

        Args:
            param: وصف المعامل - Parameter description

        Returns:
            وصف القيمة المرجعة - Return value description
        """
        pass

    def __str__(self):
        """تمثيل نصي للكائن - String representation"""
        return f"${name}()"

    def __repr__(self):
        """تمثيل تقني للكائن - Technical representation"""
        return self.__str__()
`;
  }

  /**
   * توليد نموذج اختبار
   * Generate test template
   */
  static generateTest(functionName, framework = 'jest') {
    if (framework === 'jest') {
      return `
describe('${functionName}', () => {
  test('should handle normal case', () => {
    // Arrange - التحضير
    const input = /* test input */;
    const expected = /* expected output */;

    // Act - التنفيذ
    const result = ${functionName}(input);

    // Assert - التحقق
    expect(result).toEqual(expected);
  });

  test('should handle edge cases', () => {
    expect(${functionName}(null)).toBe(/* expected */);
    expect(${functionName}(undefined)).toBe(/* expected */);
  });

  test('should handle errors', () => {
    expect(() => ${functionName}(/* invalid input */))
      .toThrow(/* expected error */);
  });
});
`;
    }
    return '// Test framework not supported';
  }

  /**
   * توليد نموذج README
   * Generate README template
   */
  static generateREADME(projectName, description) {
    return `# ${projectName}

${description}

## التثبيت - Installation

\`\`\`bash
npm install
\`\`\`

## الاستخدام - Usage

\`\`\`bash
npm start
\`\`\`

## الميزات - Features

- Feature 1
- Feature 2
- Feature 3

## المساهمة - Contributing

نرحب بالمساهمات! - Contributions are welcome!

## الرخصة - License

MIT
`;
  }

  /**
   * توليد package.json
   * Generate package.json
   */
  static generatePackageJSON(projectName, description, author) {
    return JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: description,
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        test: 'jest',
        dev: 'nodemon index.js'
      },
      keywords: [],
      author: author,
      license: 'MIT',
      dependencies: {},
      devDependencies: {
        jest: '^29.0.0',
        nodemon: '^3.0.0'
      }
    }, null, 2);
  }
}

// مثال الاستخدام - Usage Example
if (require.main === module) {
  console.log('=== Code Generator Examples ===\n');

  console.log('1. API Endpoint:');
  console.log(CodeGenerator.generateAPIEndpoint('users', 'POST'));

  console.log('\n2. React Component:');
  console.log(CodeGenerator.generateReactComponent('UserProfile', true));

  console.log('\n3. Python Class:');
  console.log(CodeGenerator.generatePythonClass('DataProcessor'));
}

module.exports = CodeGenerator;
