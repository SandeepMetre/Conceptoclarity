<?php
/*
 * Simple admin backend for uploading SSLC question papers and answer keys.
 * Features:
 *  - Basic HTTP authentication (username: admin, password: password123)
 *  - Upload question and answer PDFs
 *  - Add entry to papers.json
 *  - List existing papers with delete option
 *
 * Note: Change credentials below and secure the folder on production.
 */

// ---------- configuration ----------
$ADMIN_USER = 'admin';
$ADMIN_PASS = 'password123'; // change this!
$papers_file = __DIR__ . '/papers.json';
$downloads_dir = __DIR__ . '/downloads/';

// require authentication
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="Admin Area"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Authentication required.';
    exit;
} else {
    if ($_SERVER['PHP_AUTH_USER'] !== $ADMIN_USER || $_SERVER['PHP_AUTH_PW'] !== $ADMIN_PASS) {
        header('HTTP/1.0 403 Forbidden');
        echo 'Forbidden';
        exit;
    }
}

// ensure downloads directory exists
if (!is_dir($downloads_dir)) {
    mkdir($downloads_dir, 0755, true);
}

$message = '';

// helper to read papers
function loadPapers() {
    global $papers_file;
    if (file_exists($papers_file)) {
        $json = file_get_contents($papers_file);
        $data = json_decode($json, true);
        return is_array($data) ? $data : [];
    }
    return [];
}

// helper to save papers
function savePapers($papers) {
    global $papers_file;
    file_put_contents($papers_file, json_encode($papers, JSON_PRETTY_PRINT));
}

// handle deletion
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $papers = loadPapers();
    foreach ($papers as $index => $p) {
        if ($p['id'] === $id) {
            // delete files if exist
            if (isset($p['questionFile']) && file_exists(__DIR__ . '/' . $p['questionFile'])) {
                @unlink(__DIR__ . '/' . $p['questionFile']);
            }
            if (isset($p['answerFile']) && file_exists(__DIR__ . '/' . $p['answerFile'])) {
                @unlink(__DIR__ . '/' . $p['answerFile']);
            }
            array_splice($papers, $index, 1);
            savePapers($papers);
            $message = "Paper ID $id deleted.";
            break;
        }
    }
}

// handle upload form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'upload') {
    $name = trim($_POST['name']);
    $subject = trim($_POST['subject']);
    $description = trim($_POST['description']);
    $difficulty = trim($_POST['difficulty']);

    // validate basic fields
    if ($name === '' || $subject === '' || $description === '') {
        $message = 'Please fill all fields.';
    } else {
        $questionPath = '';
        $answerPath = '';

        // upload question file
        if (isset($_FILES['question']) && $_FILES['question']['error'] === UPLOAD_ERR_OK) {
            $qname = basename($_FILES['question']['name']);
            $qtarget = $downloads_dir . $qname;
            if (move_uploaded_file($_FILES['question']['tmp_name'], $qtarget)) {
                $questionPath = 'downloads/' . $qname;
            }
        }
        // upload answer file
        if (isset($_FILES['answer']) && $_FILES['answer']['error'] === UPLOAD_ERR_OK) {
            $aname = basename($_FILES['answer']['name']);
            $atarget = $downloads_dir . $aname;
            if (move_uploaded_file($_FILES['answer']['tmp_name'], $atarget)) {
                $answerPath = 'downloads/' . $aname;
            }
        }

        $papers = loadPapers();
        $maxId = 0;
        foreach ($papers as $p) {
            if ($p['id'] > $maxId) {
                $maxId = $p['id'];
            }
        }
        $newPaper = [
            'id' => $maxId + 1,
            'name' => $name,
            'subject' => $subject,
            'description' => $description,
            'questionFile' => $questionPath,
            'answerFile' => $answerPath,
            'difficulty' => $difficulty
        ];
        $papers[] = $newPaper;
        savePapers($papers);
        $message = 'New paper uploaded successfully.';
    }
}

// load current papers for listing
$currentPapers = loadPapers();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - Manage SSLC Papers</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        form { margin-bottom: 30px; }
        input[type=text], textarea, select { width: 100%; padding: 8px; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
        .message { padding: 10px; background: #def; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Admin Panel - Upload SSLC Papers</h1>
    <?php if ($message): ?>
        <div class="message"><?php echo htmlspecialchars($message); ?></div>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="action" value="upload">
        <label>Paper Title:</label>
        <input type="text" name="name" required>

        <label>Subject:</label>
        <select name="subject">
            <option>Science</option>
            <option>Mathematics</option>
            <option>English</option>
            <option>Social Science</option>
            <option>Other</option>
        </select>

        <label>Description:</label>
        <textarea name="description" rows="2" required></textarea>

        <label>Difficulty:</label>
        <select name="difficulty">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
        </select>

        <label>Question PDF:</label>
        <input type="file" name="question" accept="application/pdf">

        <label>Answer PDF:</label>
        <input type="file" name="answer" accept="application/pdf">

        <button type="submit">Upload Paper</button>
    </form>

    <h2>Existing Papers</h2>
    <table>
        <tr><th>ID</th><th>Name</th><th>Subject</th><th>Files</th><th>Action</th></tr>
        <?php foreach ($currentPapers as $p): ?>
        <tr>
            <td><?php echo $p['id']; ?></td>
            <td><?php echo htmlspecialchars($p['name']); ?></td>
            <td><?php echo htmlspecialchars($p['subject']); ?></td>
            <td>
                <?php if ($p['questionFile']): ?><a href="<?php echo htmlspecialchars($p['questionFile']); ?>">Q</a> <?php endif; ?>
                <?php if ($p['answerFile']): ?><a href="<?php echo htmlspecialchars($p['answerFile']); ?>">A</a><?php endif; ?>
            </td>
            <td><a href="?delete=<?php echo $p['id']; ?>" onclick="return confirm('Delete paper?')">Delete</a></td>
        </tr>
        <?php endforeach; ?>
    </table>

</body>
</html>
