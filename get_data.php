<?php
$data_file = 'data.json';

if (!file_exists($data_file)) {
    echo json_encode(["labels" => [], "values" => [], "events" => []]);
    exit;
}

$data = json_decode(file_get_contents($data_file), true);
$events = $data['events'];

$labels = [];
$values = [];
$lastDate = null;

foreach ($events as $event) {
    if ($event['is_a_date']) {
        $labels[] = $event['date'];
        if ($lastDate) {
            $values[] = (strtotime($event['date']) - strtotime($lastDate)) / 86400; // 间隔天数
        } else {
            $values[] = 0;
        }
        $lastDate = $event['date'];
    }
}

echo json_encode([
    "labels" => $labels,
    "values" => $values,
    "events" => $events
]);
?>
