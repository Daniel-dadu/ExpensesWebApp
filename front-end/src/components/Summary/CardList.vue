<template>
    <div class="row row-cols-auto justify-content-md-center">
        <div class="col">
            <div class="card border-success mb-3 card-size">
                <div class="card-header card-header-text">Total Income</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$27,000</h5>
                    <p class="card-text">Same as last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-light mb-3 card-size">
                <div class="card-header card-header-text">Total spent</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$10,500</h5>
                    <p class="card-text"><b>Goal:</b> $10,000 (3% over)</p>
                    <p class="second-card-text">2% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total saved</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$5,500</h5>
                    <p class="card-text"><b>Goal:</b> $5,000 (5% over)</p>
                    <p class="second-card-text">3% less than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total paid</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$7,000</h5>
                    <p class="card-text"><b>Goal:</b> $7,500 (3% under)</p>
                    <p class="second-card-text">5% more than last month</p>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card border-warning mb-3 card-size">
                <div class="card-header card-header-text">Total left</div>
                <div class="card-body">
                    <h5 class="card-title card-title-text">$1,500</h5>
                    <p class="card-text">2% more than last month</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style>
.card-size {
    width: 15rem;
    height: 11rem;
}

.card-header-text {
    font-size: 1.5rem;
}

.card-title-text {
    font-size: 1.5rem;
}

.second-card-text {
    margin-top: -0.5rem;
    font-size: 0.7rem;
}
</style>