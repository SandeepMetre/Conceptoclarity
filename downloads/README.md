# Concept to Clarity - Downloads Directory

## Instructions

This folder is where you should place all PDF files for:
- Question Papers
- Answer Keys

## File Naming Convention

To match the files referenced in `script.js`, use this naming pattern:

```
[Subject]_[Topic]_[Type].pdf
```

**Examples**:
- `Physics_Laws_of_Motion_Questions.pdf`
- `Physics_Laws_of_Motion_Answers.pdf`
- `Chemistry_Atomic_Structure_Questions.pdf`
- `Chemistry_Atomic_Structure_Answers.pdf`
- `Mathematics_Calculus_Basics_Questions.pdf`
- `Mathematics_Calculus_Basics_Answers.pdf`

## Steps to Add Papers

1. **Create/Prepare PDF Files**
   - Organize your question papers as PDFs
   - Ensure PDF file names match exactly what's in `script.js`

2. **Upload Files**
   - Place question paper PDFs in this folder
   - Place answer key PDFs in this folder
   - Maintain the naming convention for consistency

3. **Update script.js**
   - Open `../script.js`
   - In the `papers` array, add or modify paper objects
   - Make sure file paths match your PDF names:
     ```javascript
     questionFile: "downloads/Physics_Laws_of_Motion_Questions.pdf"
     answerFile: "downloads/Physics_Laws_of_Motion_Answers.pdf"
     ```

4. **Test**
   - Open the website in browser
   - Verify download links work properly
   - Check on mobile and desktop

## File Size Recommendations

- **Question Papers**: Try to keep under 5 MB per file
- **Answer Keys**: Try to keep under 10 MB per file
- **Total site size**: For best performance, try to keep total under 500 MB

## Optimization Tips

If PDFs are too large:
1. Reduce image quality in PDFs
2. Remove unnecessary metadata
3. Compress PDFs using online tools:
   - ilovepdf.com
   - smallpdf.com
   - pdf2go.com

## Current Papers (Sample)

The following sample papers are referenced in the website:

1. Physics - Laws of Motion (Questions & Answers)
2. Chemistry - Atomic Structure (Questions & Answers)
3. Mathematics - Calculus Basics (Questions & Answers)
4. Biology - Cell Biology (Questions & Answers)
5. Physics - Thermodynamics (Questions & Answers)
6. Chemistry - Chemical Bonding (Questions & Answers)
7. Mathematics - Geometry & Trigonometry (Questions & Answers)
8. Biology - Genetics & Heredity (Questions & Answers)

Replace these with your actual PDF files and update `script.js` accordingly.

## Troubleshooting

### Downloads not working?
- Verify file names match exactly (case-sensitive on Linux servers)
- Check file permissions (should be readable)
- Ensure files actually exist in this folder
- Check browser console for errors

### Files too slow to download?
- Compress PDFs
- Upgrade hosting plan
- Use a CDN for file distribution

## Security Notes

- PDFs are directly accessible via URL - this is intentional for easy sharing
- To restrict access, add password protection or use a script to serve files
- Keep backups of important files outside of web directory
