<?php
$data_file = 'data.json';

if (!file_exists($data_file)) {
    file_put_contents($data_file, json_encode(["events" => []]));
}

$data = json_decode(file_get_contents($data_file), true);
$date = $_POST['date'];
$is_a_date = filter_var($_POST['is_a_date'], FILTER_VALIDATE_BOOLEAN);

$updated = false;

foreach ($data['events'] as &$event) {
    if ($event['date'] === $date) {
        $event['is_a_date'] = $is_a_date; // 更新标记状态
        $updated = true;
        break;
    }
}

if (!$updated) {
    $data['events'][] = ["date" => $date, "is_a_date" => $is_a_date]; // 添加新标记
}

file_put_contents($data_file, json_encode($data));
echo json_encode(["success" => true]);
?>
